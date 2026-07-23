import { Link } from 'react-router-dom';
import { Zap, Users, Shield, Command } from 'lucide-react';

export default function AuthStage() {
 return (
 <aside className="pub-stage">
 <div className="pub-stage__content">
 <Link to="/" className="pub-stage__brand group">
 <div className="pub-stage__brand-mark transition-transform group-hover:rotate-12">
 <Command size={18} strokeWidth={2.5} />
 </div>
 adyes
 </Link>

 <p className="pub-stage__kicker">Collaboration studio</p>
 <h1 className="pub-stage__headline">
 Your calm workspace for serious delivery.
 </h1>

 <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-sm">
        Build with people who keep momentum. adyes makes every decision, update, and message feel intentional.
      </p>

 <div className="pub-stage__stats">
 {[
 { label: 'Active studios', value: '4.2k+' },
 { label: 'Weekly decisions', value: '18k+' },
 { label: 'Avg. reply time', value: '< 2h' },
 ].map((item) => (
 <div key={item.label} className="pub-stage__stat">
 <span>{item.value}</span>
 <p>{item.label}</p>
 </div>
 ))}
 </div>

 <ul className="pub-stage__features">
 <li className="pub-stage__feature">
 <div className="pub-stage__feature-icon">
 <Zap size={20} strokeWidth={1.75} />
 </div>
 <div className="pub-stage__feature-content">
 <h3 className="pub-stage__feature-title">Smart alignment</h3>
 <p className="pub-stage__feature-desc">
 Match with collaborators based on work habits, skills, and velocity.
 </p>
 </div>
 </li>

 <li className="pub-stage__feature">
 <div className="pub-stage__feature-icon">
 <Users size={20} strokeWidth={1.75} />
 </div>
 <div className="pub-stage__feature-content">
 <h3 className="pub-stage__feature-title">Verified network</h3>
 <p className="pub-stage__feature-desc">
 Collaborate with trusted builders and transparent profiles.
 </p>
 </div>
 </li>

 <li className="pub-stage__feature">
 <div className="pub-stage__feature-icon">
 <Shield size={20} strokeWidth={1.75} />
 </div>
 <div className="pub-stage__feature-content">
 <h3 className="pub-stage__feature-title">Protect the signal</h3>
 <p className="pub-stage__feature-desc">
 Stay focused with curated workflows and clear permissions.
 </p>
 </div>
 </li>
 </ul>

 <div className="pub-stage__quote">
 “The first workspace that feels like a studio, not a spreadsheet.”
 <span>— Product lead, Series A</span>
 </div>
 </div>
 </aside>
 );
}
