
import { Box } from '@mui/material'
import ChatTopbar from '../chat/components/ChatTopbar'
import { Window } from 'smart-webcomponents-react/window';
import { useEffect, useRef } from 'react';
import { Scheduler } from 'smart-webcomponents-react/scheduler';
const BookRoom = () => {
  const scheduler = useRef();
	const alertWindow = useRef();
	let targetEvent = null;
	let eventEditors = null;
  const today = new Date();
	const year = today.getFullYear();
  const month = today.getMonth();
	const date = today.getDate();

	const dataSource = [
		{
			label: 'Website Re-Design Plan',
			dateStart: new Date(year, month, date, 7, 30),
			dateEnd: new Date(year, month, date, 9, 30),
			roomId: 1,
		},
		// ... (rest of your data)
	];

	const view = 'timelineDay';
	const views = ['timelineDay', 'timelineWeek'];
	const groupOrientation = 'vertical';
	const groups = ['roomId'];

	const resources = [
		{
			label: 'Rooms',
			value: 'roomId',
			dataSource: [
				{
					label: 'Playground',
					id: 1,
					type: 'Conference',
					capacity: 10,
					backgroundColor: '#919191',
				},
				// ... (rest of your resources)
			],
		},
	];

	const groupTemplate = 'groupTemplate';

	const cellTemplate = (cell, value) => {
		cell.textContent = value.getHours() === 12 ? 'Lunch Break' : '';
	};

	const restrictedHours = [12];

	const notifyForRestrictions = (event) => {
		if (scheduler.current.isEventRestricted(event.detail.itemDateRange)) {
			openNotification();
		}
	};

	const setEventEditDetails = (event) => {
		const eventDetails = event.detail;
		targetEvent = eventDetails.item;
		eventEditors = eventDetails.editors;
	};

	const clearEventEdit = () => {
		targetEvent = undefined;
	};

	const checkEventEdit = () => {
		if (!targetEvent || !eventEditors) {
			return;
		}

		const dateStart = eventEditors.dateStart.querySelector('[event-editor]').value.toDate();
		const dateEnd = eventEditors.dateEnd.querySelector('[event-editor]').value.toDate();

		if (scheduler.current.isEventRestricted({
			dateStart: dateStart,
			dateEnd: dateEnd,
		})) {
			openNotification();
		}
	};

	const openNotification = () => {
		alertWindow.current.open();
	};

	const init = () => {
		const today = new Date();
		alertWindow.current.nativeElement.addEventListener('confirm', () => alertWindow.current.close());
		scheduler.current.scrollToDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6), true);

		const template = document.createElement('template');
		template.id = 'groupTemplate';
		template.innerHTML = `
			<span className="col" title="Room Name">{{label}}</span>
			<span className="col" title="Room Type">{{type}}</span>
			<span className="col" title="Room Capacity">{{capacity}}</span>`;
		document.body.appendChild(template);
		scheduler.current.groupTemplate = template.id;
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<div>
			<Scheduler
				ref={scheduler}
				id="scheduler"
				view={view}
				views={views}
				// groupOrientation={groupOrientation}
				// groups={groups}
				// resources={resources}
				// dataSource={dataSource}
			/>
			<Window ref={alertWindow} id="alertWindow" label="Alert">
				<h4>Event cannot last within the Lunch Break!</h4>
			</Window>
		</div>
	);
}

export default BookRoom
