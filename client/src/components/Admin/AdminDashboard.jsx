import React, {useEffect, useState, Suspense} from 'react'
const DashboardStatsGrid = React.lazy(() => import('./DashboardStatsGrid'));
const RecentTrips = React.lazy(() => import('./RecentTrips'));
import { getAllUsers, getAllDrivers } from '../../services/AuthService';
import { getAllTrips } from '../../services/TripService';
import { getAccessToken } from '../../services/AuthService';

function AdminDashboard() {
  const token = getAccessToken();
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [tripInProgressCount, setTripInProgressCount] = useState(0);
  const [tripCompletedCount, setTripCompletedCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);

   useEffect(() => {
    const fetchAll = async () => {
      try {
        const users = await getAllUsers();
        const drivers = await getAllDrivers()
        const trips = await getAllTrips();
        setUserCount(users['count']);
        setDriverCount(drivers['count']);
        setTripInProgressCount(trips['in_progress_count']);
        setTripCompletedCount(trips['completed_count']);
        setIsLoading(false);
        console.log(users['count']);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);
  
  return (
    <div className="flex justify-start items-center flex-col gap-4">
      {isLoading ? (
        <div className="flex items-center h-full">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <Suspense >
          <DashboardStatsGrid userCount={userCount} driverCount={driverCount} tripInProgressCount={tripInProgressCount} tripCompletedCount={tripCompletedCount} />
        </Suspense>
      )}
    </div>
  )
}

export default AdminDashboard