import { useState, useEffect } from 'react';
import Modal from './Modal';
import { contentService } from '../services/content.service';
import toast from 'react-hot-toast';

export default function ContentModal({ open, onClose, type, item, userId, authorName, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });

  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        tags: item.tags ? item.tags.join(', ') : ''
      });
    } else {
      setFormData({ title: '', description: '', tags: '' });
    }
  }, [item, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    
    setLoading(true);
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        userId: userId,
        authorName: authorName || 'Anonymous'
      };

      if (isEdit) {
        if (type === 'idea') {
          await contentService.updateIdea(item.id, data);
        } else {
          await contentService.updateProject(item.id, data);
        }
        toast.success(`${type === 'idea' ? 'Idea' : 'Project'} updated!`);
      } else {
        if (type === 'idea') {
          await contentService.createIdea(data);
        } else {
          await contentService.createProject(data);
        }
        toast.success(`${type === 'idea' ? 'Idea' : 'Project'} created!`);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <button type="button" onClick={onClose} className="btn btn-ghost" disabled={loading}>Cancel</button>
      <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${isEdit ? 'Edit' : 'New'} ${type === 'idea' ? 'Idea' : 'Project'}`}
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold">Title</span>
          <input
            type="text"
            className="input h-10 w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={`A brilliant new ${type}...`}
          />
        </label>
        
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold">Description</span>
          <textarea
            className="input min-h-[120px] w-full py-2 resize-y"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={`Describe your ${type}...`}
          />
        </label>

        {type === 'idea' && (
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold">Tags (comma separated)</span>
            <input
              type="text"
              className="input h-10 w-full"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, Next.js, AI"
            />
          </label>
        )}
      </form>
    </Modal>
  );
}
