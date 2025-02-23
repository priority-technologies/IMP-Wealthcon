'use client';
import React, { Fragment, useState } from 'react';
import Filter from '../../components/Filter';
import GallaryImages from '../../components/GallaryImages';
import usePreventActions from '@/hooks/usePreventActions';

function Gallary() {
	//usePreventActions();
	const [view, setView] = useState('grid');
	const [filterSelect, setFilterSelect] = useState({
		sortBy: null,
	});

	return (
		<Fragment>
			<Filter
				title='Charts'
				type='gallary'
				view={view}
				setView={setView}
				filterSelect={filterSelect}
				setFilterSelect={setFilterSelect}
			/>
			<GallaryImages
				view={view}
				setView={setView}
				editAble={false}
				filter={filterSelect}
			/>
		</Fragment>
	);
}

export default Gallary;
