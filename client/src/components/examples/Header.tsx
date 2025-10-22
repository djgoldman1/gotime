import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header onProfileClick={() => console.log('Profile clicked')} />
  );
}
