'use client';
import React, { Fragment, useEffect, useState } from 'react';
import logo from '../../assets/images/thumb-logo.jpg';
import axios from 'axios';
import PageLoading from "../../components/Loading/PageLoading"


function Home() {
	const [loading,setLoading] = useState(false);
	const [quotes,setQuotes] = useState();
	
	async function getQuote(){
		try {
			setLoading(true);
			const res = await axios.get(`/api/quote`);
			if (res.status !== 200) {
			  return;
			}
			const { data } = res;
			if(data && data?.quotes && data?.quotes?.length){
				setQuotes(data?.quotes[0]);
			}
		  } catch (error) {
			if (error?.response?.status === 401) {
			  return router.push("/login");
			}
			alert(error.message)
			console.error("Error fetching video:", error.message);
		  } finally {
			setLoading(false);
		  }
	}

	useEffect(()=>{
		getQuote();
	},[])

	if (loading) {
		return <PageLoading />;
	  }
 
	return (
		<Fragment>
			<img src={quotes && quotes?.image ? quotes?.image :logo.src} alt="Banner Image" className='home-banner-image' />		
		</Fragment>
	);
}

export default Home;
