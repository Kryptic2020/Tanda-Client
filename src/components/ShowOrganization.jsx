import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { leaveOrg, showOrg } from '../services/organizationServices';

export default function ShowOrganization(history) {
	const [orgState, setOrgState] = useState({});

	const handleLeave = () => {
		leaveOrg(history.match.params.id)
			.then(() => {
				history.history.push('/')			
		})
	}
		
	useEffect(()=>{showOrg(history.match.params.id).then((data)=> setOrgState(data) )},[])
  return (
    <div>
      <section className='container col-11 col-md-9 col-lg-3 bg-light my-2 py-5 px-4 rounded'>
				<Form>
					<h3>{orgState && orgState.name}</h3>
						<div className='d-flex justify-content-between mt-5'>
						<Link to={`/shift/${history.match.params.id}`}><Button
						variant='dark'
					>
						View Shifts
					</Button></Link>
					<Link
								className='mx-4'
								to={`/organization/update/${history.match.params.id}`}
							>
								Edit
							</Link>
						<Button
							variant='secondary'
							onClick={handleLeave}
						>
							Leave
						</Button>
				</div>
				</Form>
			</section>
      
    </div>
  )
}
