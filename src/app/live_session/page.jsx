'use client';
import React, { Fragment, useState } from 'react';
import Filter from '../../components/Filter';
import LiveSessionVideos from '../../components/LiveSessionVideos';
import usePreventActions from '@/hooks/usePreventActions';

function LiveSession() {
	//usePreventActions();
	const [view, setView] = useState('grid');
	const [filterSelect, setFilterSelect] = useState({
		sortBy: null,
		category: null,
	});

	return (
		<Fragment>
			<Filter
				title='Videos'
				type='liveSession'
				view={view}
				setView={setView}
				filterSelect={filterSelect}
				setFilterSelect={setFilterSelect}
			/>
			<LiveSessionVideos
				view={view}
				setView={setView}
				filter={filterSelect}
			/>
		</Fragment>
	);
}

export default LiveSession;
