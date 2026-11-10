"use client";
import { useEffect,useState } from "react";
export default function DownloadPropertyContext(){
 const [id,setId]=useState<string|null>(null);
 useEffect(()=>{const value=new URLSearchParams(window.location.search).get('property');if(value&&/^[1-9]\d*$/.test(value)&&Number(value)<=2147483647)setId(value);},[]);
 return id?<p className="mx-auto mt-6 max-w-3xl rounded-xl bg-emerald-50 p-4 text-emerald-900"><a className="font-bold underline" href={`/properties/${id}`}>Return to property #{id}</a>. After installing, reopen the property link to continue. Installing the app does not automatically carry the property into it.</p>:null;
}
