import { CompanySection } from './CompanySection';
import { TeamPanel } from './TeamPanel';
import { teamAreas } from '../../data/team';
import '../../styles/team.css';

export function TeamSection() {
  return <CompanySection id="team" title="OUR TEAM" intro="The people behind every project">
    <div className="company-grid">
      {teamAreas.map((area, index) => <TeamPanel key={area.id} area={area} number={index + 1}/>)}
    </div>
  </CompanySection>;
}
