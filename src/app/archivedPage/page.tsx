import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabaseclient';
import { useSession } from 'next-auth/react';
const ArchivedPage = () => {
  return (
    <div>
      <h1>Archived Posts</h1>
      {/* We'll add the posts and search bar here next */}
    </div>
  );
};

export default ArchivedPage;