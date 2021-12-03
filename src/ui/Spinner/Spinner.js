import React from 'react';
import './stylesSpin.css';

const spinner = () => (
	<div id="cover">
		<div id="spinner" className="preloader-wrapper center small active">
			<div className="spinner-layer spinner-blue">
				<div className="circle-clipper left">
					<div className="circle"></div>
				</div><div className="gap-patch">
					<div className="circle"></div>
				</div><div className="circle-clipper right">
					<div className="circle"></div>
				</div>
			</div>

			<div className="spinner-layer spinner-red">
				<div className="circle-clipper left">
					<div className="circle"></div>
				</div><div className="gap-patch">
					<div className="circle"></div>
				</div><div className="circle-clipper right">
					<div className="circle"></div>
				</div>
			</div>

			<div className="spinner-layer spinner-yellow">
				<div className="circle-clipper left">
					<div className="circle"></div>
				</div><div className="gap-patch">
					<div className="circle"></div>
				</div><div className="circle-clipper right">
					<div className="circle"></div>
				</div>
			</div>

			<div className="spinner-layer spinner-green">
				<div className="circle-clipper left">
					<div className="circle"></div>
				</div><div className="gap-patch">
					<div className="circle"></div>
				</div><div className="circle-clipper right">
					<div className="circle"></div>
				</div>
			</div>
		</div>
		<span id="loading-text">
			<p id="blink">Loading info ...</p>
		</span>
	</div>
);

export default spinner;