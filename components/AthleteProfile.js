import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaHeart, FaComment, FaShare, FaBasketballBall, FaCheck } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

export default function AthleteProfile() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Mock fetch - replace with supabase.from('athletes').select('*').eq('id', id)
      setTimeout(() => setProfile({
        name: 'Jordan Lee',
        username: '@jordanlee',
        bio: '6\'2 Guard grinding #Hoops',
        photo: 'https://source.unsplash.com/random/150x150/?athlete',
        verified: true,
        sport: <FaBasketballBall className="text-blue-400" />,
        feed: [
          { caption: 'New dunk!', likes: 100, media: 'https://source.unsplash.com/random/?basketball' },
          { caption: 'Shooting session', likes: 80, media: 'https://source.unsplash.com/random/?gym' },
        ]
      }), 500);
    }
  }, [id]);

  if (!profile) return <div className="text-white text-center p-8">Loading...</div>;

  const PostCard = ({ post }) => (
    <div className="bg-gray-900 mb-4 p-3 rounded">
      <img src={post.media} alt="" className="w-full h-64 object-cover rounded mb-2" />
      <p>{post.caption}</p>
      <div className="flex gap-4 mt-2">
        <FaHeart className="text-red-500" /> {post.likes}
        <FaComment /> <FaShare />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="text-center mb-6">
        <img src={profile.photo} alt={profile.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
        <p className="text-gray-400 mb-2">{profile.username}</p>
        <p className="text-gray-300 mb-4">{profile.bio}</p>
        {profile.sport}
        {profile.verified && <FaCheck className="text-green-500 ml-2" />}
      </div>
      <div className="space-y-4">
        {profile.feed.map((post, i) => <PostCard key={i} post={post} />)}
      </div>
    </div>
  );
}