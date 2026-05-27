import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import numpy as np
import faiss
import pickle
import json
from fastembed import TextEmbedding
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Firebase Configuration
# Firebase Initialization
try:
    if "FIREBASE_ADMIN_CREDENTIALS" in os.environ:
        cred_dict = json.loads(os.environ["FIREBASE_ADMIN_CREDENTIALS"])
        cred = credentials.Certificate(cred_dict)
    else:
        cred = credentials.Certificate("firebase-key.json")
    
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    FIREBASE_ENABLED = True
    print("Firebase connected successfully!")

except Exception as e:
    print(f"Firebase initialization failed: {e}")
    print("Running in demo mode without Firebase")
    FIREBASE_ENABLED = False
    db = None


# Initialize FastEmbed Model
print("Loading FastEmbed model...")
model_cache_path = os.path.join(os.path.dirname(__file__), 'model_cache')
os.makedirs(model_cache_path, exist_ok=True)
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2", cache_dir=model_cache_path)
print("FastEmbed model loaded successfully! (Low memory ONNX runtime)")

# FAISS indexes
ideas_index = None
projects_index = None
ideas_metadata = []
projects_metadata = []

FAISS_DIR = 'faiss_indexes'
os.makedirs(FAISS_DIR, exist_ok=True)

IDEAS_INDEX_PATH = os.path.join(FAISS_DIR, 'ideas_index.faiss')
IDEAS_META_PATH = os.path.join(FAISS_DIR, 'ideas_metadata.pkl')
PROJECTS_INDEX_PATH = os.path.join(FAISS_DIR, 'projects_index.faiss')
PROJECTS_META_PATH = os.path.join(FAISS_DIR, 'projects_metadata.pkl')


def create_embedding(text):
    """Create embedding using FastEmbed (runs locally via ONNX, low memory)"""
    try:
        # FastEmbed returns a generator, so we convert to list and take the first item
        embedding = list(model.embed([text]))[0]
        return np.array(embedding, dtype='float32')
    except Exception as e:
        print(f"Embedding error: {e}")
        return np.zeros(384, dtype='float32')


def initialize_indexes():
    """Initialize or load FAISS indexes"""
    global ideas_index, projects_index, ideas_metadata, projects_metadata
    
    # Check if indexes exist
    if os.path.exists(IDEAS_INDEX_PATH) and os.path.exists(IDEAS_META_PATH):
        print("Loading existing ideas index...")
        ideas_index = faiss.read_index(IDEAS_INDEX_PATH)
        with open(IDEAS_META_PATH, 'rb') as f:
            ideas_metadata = pickle.load(f)
        print(f"Loaded {len(ideas_metadata)} ideas")
    else:
        print("Creating new ideas index...")
        dimension = 384  # all-MiniLM-L6-v2 dimension
        ideas_index = faiss.IndexFlatL2(dimension)
        ideas_metadata = []
    
    if os.path.exists(PROJECTS_INDEX_PATH) and os.path.exists(PROJECTS_META_PATH):
        print("Loading existing projects index...")
        projects_index = faiss.read_index(PROJECTS_INDEX_PATH)
        with open(PROJECTS_META_PATH, 'rb') as f:
            projects_metadata = pickle.load(f)
        print(f"Loaded {len(projects_metadata)} projects")
    else:
        print("Creating new projects index...")
        dimension = 384
        projects_index = faiss.IndexFlatL2(dimension)
        projects_metadata = []
        
        # If we have Firebase, auto-rebuild since the disk might have been wiped
        if FIREBASE_ENABLED:
            print("Auto-rebuilding indexes from Firebase...")
            do_rebuild_indexes()


def do_rebuild_indexes():
    global ideas_index, projects_index
    global ideas_metadata, projects_metadata

    try:
        print("\n========== AUTO-REBUILDING FAISS INDEXES ==========\n")

        print("Fetching ideas from Firebase...")
        ideas_docs = list(db.collection('ideas').stream())
        print(f"Found {len(ideas_docs)} ideas\n")

        for i, doc in enumerate(ideas_docs):
            try:
                data = doc.to_dict()
                add_to_index('ideas', doc.id, data)
            except Exception as e:
                pass

        print("\nFetching projects from Firebase...")
        projects_docs = list(db.collection('projects').stream())
        print(f"Found {len(projects_docs)} projects\n")

        for i, doc in enumerate(projects_docs):
            try:
                data = doc.to_dict()
                add_to_index('projects', doc.id, data)
            except Exception as e:
                pass

        save_indexes()
        print("\n========== INDEXING COMPLETE ==========\n")
    except Exception as e:
        print(f"\nREBUILD ERROR: {e}\n")


def save_indexes():
    """Save FAISS indexes to disk"""
    faiss.write_index(ideas_index, IDEAS_INDEX_PATH)
    with open(IDEAS_META_PATH, 'wb') as f:
        pickle.dump(ideas_metadata, f)
    
    faiss.write_index(projects_index, PROJECTS_INDEX_PATH)
    with open(PROJECTS_META_PATH, 'wb') as f:
        pickle.dump(projects_metadata, f)
    
    print("Indexes saved successfully!")


def add_to_index(collection_type, doc_id, data):
    """Add document to appropriate FAISS index"""
    # Create searchable text from document
    searchable_text = f"{data.get('title', '')} {data.get('description', '')} "
    searchable_text += ' '.join(data.get('tags', []))
    searchable_text += ' '.join(data.get('required_skills', []))
    searchable_text += f" {data.get('category', '')}"
    
    # Create embedding
    embedding = create_embedding(searchable_text)
    embedding = np.array([embedding]).astype('float32')
    
    createdAt_val = data.get('createdAt')
    if not isinstance(createdAt_val, str):
        # Handle cases where createdAt is a firestore Sentinel object or datetime
        createdAt_val = datetime.now().isoformat()

    # Add metadata
    metadata = {
        'id': doc_id,
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'category': data.get('category', ''),
        'tags': data.get('tags', []),
        'required_skills': data.get('required_skills', []),
        'upvotes': data.get('upvotes', 0),
        'status': data.get('status', ''),
        'submitted_by': data.get('submitted_by', ''),
        'userId': data.get('userId', ''),
        'authorName': data.get('authorName', 'Anonymous'),
        'visibility': data.get('visibility', 'public'),
        'createdAt': createdAt_val
    }
    
    if collection_type == 'ideas':
        ideas_index.add(embedding)
        ideas_metadata.append(metadata)
    else:
        projects_index.add(embedding)
        projects_metadata.append(metadata)
    
    save_indexes()


def search_index(collection_type, query, top_k=10):
    """Search in FAISS index"""
    if collection_type == 'ideas':
        index = ideas_index
        metadata = ideas_metadata
    else:
        index = projects_index
        metadata = projects_metadata
    
    if index.ntotal == 0:
        return []
        
    k = min(top_k, index.ntotal)
    
    # Return latest items if query is empty
    if not query or not query.strip():
        # metadata is appended chronologically (oldest to newest), so we take the last k
        results = []
        for meta in reversed(metadata):
            if meta.get('deleted'):
                continue
            result = meta.copy()
            result['similarity_score'] = 1.0
            results.append(result)
            if len(results) >= k:
                break
        return results
    
    # Create query embedding
    query_embedding = create_embedding(query)
    query_embedding = np.array([query_embedding]).astype('float32')
    
    # Search
    distances, indices = index.search(query_embedding, k)
    
    # Get results
    results = []
    for idx, distance in zip(indices[0], distances[0]):
        if idx < len(metadata):
            result = metadata[idx].copy()
            if result.get('deleted'):
                continue
            result['similarity_score'] = float(1 / (1 + distance))  # Convert distance to similarity
            results.append(result)
    
    return results


@app.route('/')
def index():
    """Render main page"""
    return render_template('index.html')


@app.route('/api/search', methods=['POST'])
def search():
    """Search for ideas or projects"""
    data = request.json
    query = data.get('query', '')
    collection_type = data.get('type', 'ideas')  # 'ideas' or 'projects'
    top_k = data.get('top_k', 10)
    
    if collection_type not in ['ideas', 'projects']:
        return jsonify({'error': 'Type must be "ideas" or "projects"'}), 400
    
    results = search_index(collection_type, query, top_k)
    
    return jsonify({
        'query': query,
        'type': collection_type,
        'results': results,
        'count': len(results)
    })


@app.route('/api/submit', methods=['POST'])
def submit():
    """Submit a new idea or project"""
    data = request.json
    collection_type = data.get('type', 'ideas')
    
    if collection_type not in ['ideas', 'projects']:
        return jsonify({'error': 'Type must be "ideas" or "projects"'}), 400
    
    # Validate required fields
    required_fields = ['title', 'description']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Prepare document data
    doc_data = {
        'title': data['title'],
        'description': data['description'],
        'category': data.get('category', 'general'),
        'tags': data.get('tags', []),
        'required_skills': data.get('required_skills', []),
        'status': data.get('status', 'pending'),
        'userId': data.get('userId', 'anonymous'),
        'authorName': data.get('authorName', 'Anonymous'),
        'submitted_by': data.get('submitted_by', data.get('userId', 'anonymous')),
        'visibility': data.get('visibility', 'public'),
        'type': collection_type,
        'upvotes': 0,
        'createdAt': firestore.SERVER_TIMESTAMP if FIREBASE_ENABLED else datetime.now().isoformat(),
        'updatedAt': firestore.SERVER_TIMESTAMP if FIREBASE_ENABLED else datetime.now().isoformat()
    }
    
    try:
        doc_id = data.get('id')
        
        # Add to Firebase ONLY if id was not provided
        if not doc_id:
            if FIREBASE_ENABLED:
                collection_name = collection_type
                doc_ref = db.collection(collection_name).add(doc_data)
                doc_id = doc_ref[1].id
            else:
                # Generate a dummy ID for demo mode
                doc_id = f"demo_{collection_type}_{len(ideas_metadata if collection_type == 'ideas' else projects_metadata)}"
        
        # Add to FAISS index
        add_to_index(collection_type, doc_id, doc_data)
        
        return jsonify({
            'success': True,
            'id': doc_id,
            'message': f'{collection_type[:-1].capitalize()} submitted successfully!'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/delete', methods=['POST', 'OPTIONS'])
def delete_item():
    """Soft delete an item from the index and Firebase"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response, 200

    data = request.json
    doc_id = data.get('id')
    collection_type = data.get('type')
    
    if not doc_id or not collection_type:
        return jsonify({'error': 'id and type required'}), 400
        
    global ideas_metadata, projects_metadata
    metadata = ideas_metadata if collection_type == 'ideas' else projects_metadata
        
    for meta in metadata:
        if meta.get('id') == doc_id:
            meta['deleted'] = True
            save_indexes()
            
            # Delete from Firebase if enabled
            if FIREBASE_ENABLED:
                try:
                    db.collection(collection_type).document(doc_id).delete()
                except Exception as e:
                    print("Firebase delete error:", e)
                    
            return jsonify({'success': True})
            
    return jsonify({'error': 'Not found'}), 404


@app.route('/api/stats', methods=['GET'])
def stats():
    """Get statistics about the database"""
    return jsonify({
        'ideas_count': len(ideas_metadata),
        'projects_count': len(projects_metadata),
        'firebase_enabled': FIREBASE_ENABLED
    })

@app.route('/api/rebuild-indexes', methods=['POST'])
def rebuild_indexes():
    """Rebuild FAISS indexes from Firebase (admin function)"""

    if not FIREBASE_ENABLED:
        return jsonify({'error': 'Firebase not enabled'}), 400

    global ideas_index, projects_index
    global ideas_metadata, projects_metadata

    # Reset indexes
    dimension = 384
    ideas_index = faiss.IndexFlatL2(dimension)
    projects_index = faiss.IndexFlatL2(dimension)
    ideas_metadata = []
    projects_metadata = []

    do_rebuild_indexes()

    return jsonify({
        'success': True,
        'ideas_indexed': len(ideas_metadata),
        'projects_indexed': len(projects_metadata)
    })

print("Initializing indexes...")
initialize_indexes()

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5108)