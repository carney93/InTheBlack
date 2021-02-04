import Firebase from 'firebase';
const firebaseConfig = {
apiKey: 'AIzaSyAF6p1lCjko6zoSNwp3WIO0gkQM5k4dU7M',
databaseURL: 'https://intheblack-851a8.firebaseio.com/',
projectId: 'intheblack-851a8',
storageBucket: 'gs://intheblack-851a8.appspot.com/',
appId: '1:781362841875:android:1013a804fa30eafc35f2e6',
};
export default Firebase.initializeApp(firebaseConfig);