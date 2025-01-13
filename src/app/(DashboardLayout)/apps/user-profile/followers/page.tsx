import {Grid2 as Grid } from '@mui/material';
 import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import FollowerCard from '@/app/components/apps/userprofile/followers/FollowerCard';


const Followers = () => {
  return (
    (<PageContainer title="Followers" description="this is Followers">
      <Grid container spacing={3}>
        <Grid
          size={{
            sm: 12
          }}>
          <ProfileBanner />
        </Grid>
        <Grid
          size={{
            sm: 12
          }}>
          <FollowerCard />
        </Grid>
      </Grid>
    </PageContainer>)
  );
};

export default Followers;
