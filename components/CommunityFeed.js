import { useState } from 'react';
import { FaHome, FaMessage, FaHeart, FaComment, FaShare, FaBasketballBall } from 'react-icons/fa';

export default function CommunityFeed() {
  const [activeTab, setActiveTab] = useState('feed');
  const feed = [
    { id: 1, caption: 'Dunk practice! #Hoops', likes: 234, media: 'https://source.unsplash.com/random/400x500/?basketball', sport: <FaBasketballBall /> },
    { id: 2, caption: 'Speed drills today', likes: 156, media: 'https://source.unsplash.com/random/400x500/?running', sport: <FaBasketballBall /> },
  ];

  const PostCard = ({ post }) => (
    <div className="bg-gray-900 mb-4 p-3 rounded overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <img src="https://source.unsplash.com/random/50x50/?athlete" className="w-8 h-8 rounded-full" />
        <span className="font-semibold">Athlete</span>
        {post.sport}
      </div>
      <img src={post.media} alt="" className="w-full h-64 object-cover rounded mb-2" />
      <p className="mb-2">{post.caption}</p>
      <div className="flex gap-4 text-sm">
        <FaHeart className="text-red-500" /> {post.likes} likes
        <FaComment /> <FaShare />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 flex justify-around py-2 z-10">
        <FaHome onClick={() => setActiveTab('feed')} className={activeTab === 'feed' ? 'text-blue-400' : 'text-gray-400'} />
        <FaMessage onClick={() => setActiveTab('messages')} className={activeTab === 'messages' ? 'text-blue-400' : 'text-gray-400'} />
      </div>
      <div className="pt-4 pb-20 px-4">
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {feed.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
        {activeTab === 'messages' && <div className="text-center py-20">DMs coming soon!</div>}
      </div>
    </div>
  );
}