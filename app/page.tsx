"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');

  return (
    <div className="bg-[#202020]">
       <input type="text" placeholder="enter your name" className="p-3" onChange={(e) => setName(e.target.value)} value={name}/>

       <div className="bg-teal-700 mt-12">
        {name ? `Hello, ${name}` : 'Please enter your name'}
       </div>
    </div>
  );
}
