gsap.config({trialWarn: false});
let select = s => document.querySelector(s),
		toArray = s => gsap.utils.toArray(s),
		mainSVG = select('#mainSVG'),
		dragger = select('#dragger'),
		trackFill = select('#trackFill'),
		minX = 220,
		maxX = 360,
		robotArm = select('#robotArm'),
		draggerOffsetX = 0,
		initArmPosY = 500,
		trackWidth = 378,
		draggable,
		robotWidth =robotArm.getBBox().width,
		textColorArray = ['#f0f0f0', '#1789f2'],
		textFadeArray = ['#1789f2', '#f0f0f0'],
		textColorInterp = gsap.utils.interpolate(textFadeArray),
		allText = toArray('#labels text'),
		draggerProp = gsap.getProperty(dragger),
		robotArmProp = gsap.getProperty(robotArm),
		pipeDuration = gsap.utils.pipe(
			gsap.utils.clamp(0, 3),
			gsap.utils.mapRange(0, 3, 0.5, 1.2)
		),
		progressPipe = (
			gsap.utils.mapRange(0, 1, 0, allText.length)
		)

gsap.set('svg', {
	visibility: 'visible'
})
gsap.set(dragger, {
	y: 300
})

allText.forEach((c, i) => {
	const initY = 360;
	const initX = 206;
	const textSpacer = 33;
	gsap.set(c, {
		x: initX + (i * textSpacer),
		y: initY,
		textContent: i
	})
})

function followRobotArm () {
	
	if(robotArmProp('x') + draggerOffsetX - robotWidth  <= draggerProp('x')  ) {
		
		gsap.set(dragger, {
			x: robotArmProp('x') + robotWidth - draggerOffsetX
		})
		onDrag()
	}
}

function onRelease () {
	if(minX + maxX == draggerProp('x')) return
	
	draggable[0].disable();
	let x = draggerProp('x') - robotWidth + draggerOffsetX;
	let y = draggerProp('y') - 10;

	gsap.set(robotArm, {
		x,
		y: initArmPosY
	})
	let duration = (x - minX)/100;
	//console.log('duration', duration)
	let robotTl = gsap.timeline({
		onComplete: draggable[0].enable
	});
	robotTl.add('intro')
	.to(robotArm, {
		y,
		duration: 0.63,
		ease: 'elastic(0.3, 0.57)'
	}, 'intro')
.fromTo(robotArm, {
		transformOrigin: '100% 100%',
		rotation: -32
	},{
		rotation: -0,
		transformOrigin: '100% 100%',
		duration: 0.63,
		ease: 'elastic(0.3, 0.57)'
	}, 'intro')
	.to(['#littleFinger','#middleFinger'], {
		rotation: -23,
		stagger: 0.018,
		duration: 0.5,
		transformOrigin: '10% 10%',
		ease: 'elastic(0.38, 0.85)'
	}, 'intro+=0.2')
	.add('back')
	.to(robotArm, {
		x: '-=2',
		duration: 0.26,
		ease: 'slow(0.3, 0.8, true)'
	}, 'back')
	.to(robotArm, {
		rotation: '-=2',
		transformOrigin: '30% 100%',
		duration: 0.23,
		ease: 'power2.inOut'
	}, 'back')
	.to(['#middleFinger','#littleFinger'], {
		rotation: -0,
		stagger: 0.008,
		duration: 0.94,
		ease: 'power2.in'
	}, 'back')
	
		.add('reset', '-=0.5')
	.to(robotArm, {
		x: minX + maxX - robotWidth,
		transformOrigin: '50% 50%',
		duration: pipeDuration(duration),
		onUpdate: followRobotArm,
		ease: 'sine.inOut'
	}, 'reset+=0.13')
	.to(robotArm, {
		rotation: 0,
		//transformOrigin: '50% 50%',
		duration: 0.13,
		transformOrigin: '30% 100%',
		ease: 'power2.in'
	}, 'reset')
	
	.add('fingerLift', '+=0.8')
	.to('#indexFinger', {
		duration: 0.3,
		morphSVG: {
			shape: '#indexFingerEnd',
		},
		ease: 'power1.inOut'
	}, 'fingerLift')
.to('#indexJoint', {
		duration: 0.3,
		x: -3,
		y: -2,
		rotation: -12,
		transformOrigin: '50% 50%',
		ease: 'power1.inOut'
	}, 'fingerLift')
	.add('fingerTap')
.to('#indexFinger', {
		duration: 0.1,
		repeat: 2,
		yoyo: true,
		morphSVG: {
			shape: "m106.67,89.76c6.99-5.54,16.45-13.11,4.18-27.33l-.72-18.68c-.09-2.32.76-4.59,2.35-6.28l17.62-18.63c2.7-2.78,2.64-7.22-.14-9.92-2.78-2.7-7.22-2.64-9.92.14-.05.05-.09.09-.13.14l-19.46,20.59c-1.79,1.89-3.3,4.02-4.49,6.33l-12.62,24.55c-2.1,4.07-1.51,9,1.48,12.47l13.88,16.1c2.03,2.35,5.58,2.6,7.93.57.01-.01.03-.03.04-.04Z",
		},
		ease: 'power1.inOut'
	}, 'fingerTap')
.to('#indexJoint', {
		duration: 0.1,
		repeat: 2,
		yoyo: true,
		x: 0,
		y: 0,
		rotation: -0,
		transformOrigin: '50% 50%',
		ease: 'power1.inOut'
	}, 'fingerTap')

	.add('armLeave', '+=0.3')
	.to(robotArm, {
		y: initArmPosY,
		duration: 0.36,
		ease: 'back.in(0.83)'
	}, 'armLeave')
.to(robotArm, {
		rotation: -12,
		transformOrigin: '100% 100%',
		duration: 0.48,
		ease: 'sine.inOut'
	}, 'armLeave')
	.to(['#middleFinger','#littleFinger'], {
		rotation: -30,
		stagger: 0.08,
		duration: 0.25,
		ease: 'power2.in'
	}, 'armLeave')
.set(['#middleFinger','#littleFinger'], {
		rotation: 0
	})
	
}

function onDrag () {
	let progress = (draggerProp('x') - minX) / (maxX);
	let size = trackWidth -  (progress * trackWidth + draggerProp('r')/2);
	gsap.set(trackFill, {
		width: trackWidth - size
	});
	let currentId = gsap.utils.snap(1, progressPipe(progress)) 
	let distributor = gsap.utils.distribute({
			base: 0,
			amount: 1,
			from: currentId,
			ease: "expo"
	 });
	gsap.to(allText, {
		fill: (i, c) => textColorInterp(distributor(i, c, allText))
	})
	
}
draggable = Draggable.create(dragger, {
	type: 'x',
	bounds: {minX: minX, maxX: minX + maxX},
	onRelease: onRelease,
	onDrag: onDrag
})
gsap.to(dragger, {
	x: minX + maxX,
	onUpdate: draggable[0].vars.onDrag,
	duration: 1,
	ease: 'expo.inOut'
})