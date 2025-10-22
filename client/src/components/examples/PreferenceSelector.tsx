import PreferenceSelector from '../PreferenceSelector';
import bearsLogo from '@assets/generated_images/Chicago_Bears_team_logo_b4c6c9fa.png';
import bullsLogo from '@assets/generated_images/Chicago_Bulls_team_logo_a3692be6.png';

const mockTeams = [
  { id: "1", name: "Chicago Bears", image: bearsLogo },
  { id: "2", name: "Chicago Bulls", image: bullsLogo },
  { id: "3", name: "Chicago Cubs" },
  { id: "4", name: "Chicago White Sox" },
  { id: "5", name: "Chicago Blackhawks" },
  { id: "6", name: "Chicago Fire FC" },
];

export default function PreferenceSelectorExample() {
  return (
    <div className="p-4">
      <PreferenceSelector
        title="Select Your Favorite Teams"
        description="Choose the sports teams you want to follow"
        placeholder="Search teams..."
        options={mockTeams}
        selectedIds={["1"]}
        onSelectionChange={(ids) => console.log('Selected teams:', ids)}
      />
    </div>
  );
}
