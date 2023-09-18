'use client';

import { useContext, useEffect, useState } from 'react';
import styles from '../../page.module.sass';
import SessionContext from '../../contexts/sessionContext';
import requests from '@/app/validations/axios.module';
import { date } from 'yup';

export default function Profile() {
	const session = useContext(SessionContext);
	const request = requests();

	const [bio, setBio] = useState('');
	const [birth, setBirth] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	function handleSubmit(e: any) {
		e.preventDefault();
		const user = {
			...session,
			bio: bio,
			birth: birth,
		};

		console.log('user: ', user);

		request.put('/profile', user).then((res) => {
			console.log(res.data);
		});
	}

	function handleEditClick() {
		setIsEditing(true);
	}

	const handleBio = (data: string) => {
		setBio(data || '');
	};

	const handleBirth = (data: string) => {
		setBirth(data || '');
	};

	function dateConverter(data: string) {
		const formatedDate = data.substring(0, 10);
		return formatedDate;
	}

	const handleSaveClick = () => {
		const user = {
			...session,
			bio: bio,
			birth: birth,
		};

		request.put('/profile', user).then((res) => {
			console.log(res.data);
		});

		setIsEditing(false);
	};

	useEffect(() => {
		function dateConverter(data: string) {
			const formatedDate = data.substring(0, 10);
			return formatedDate;
		}
		if (!isEditing) {
			request.post('/profile', session).then((res) => {
				handleBio(res.data.bio);
				const birth = dateConverter(res.data.birth);
				handleBirth(birth);
			});
		}
	}, [request, session, isEditing]);

	return (
		<SessionContext.Provider value={session}>
			<div>
				<h1>Profile de {session.user}</h1>
				<form
					action='submit'
					name='editProfileForm'
					className={styles.prodCreationForm}
				>
					<input
						placeholder='Username'
						className={styles.input}
						type='text'
						name='username'
						value={session.user}
						readOnly
					/>

					{isEditing ? (
						<>
							<input
								placeholder='00/00/0000'
								className={styles.input}
								type='date'
								name='birthday'
								onChange={(e) => setBirth(e.target.value)}
								value={birth}
							/>
							<textarea
								placeholder='Bio'
								className={styles.input}
								name='bio'
								onChange={(e) => setBio(e.target.value)}
								value={bio}
							/>
						</>
					) : (
						<>
							<input
								placeholder='00/00/0000'
								className={styles.input}
								type='date'
								name='birthday'
								value={dateConverter(birth)}
								readOnly
							/>
							<textarea
								placeholder='Bio'
								className={styles.input}
								name='bio'
								value={bio}
								readOnly
							/>
						</>
					)}
					<div>
						<button
							className={styles.inputBtn}
							type='button'
							onClick={handleEditClick}
						>
							Editar Perfil
						</button>
						<button
							className={styles.inputBtn}
							type='button'
							onClick={handleSaveClick}
						>
							Salvar Perfil
						</button>
					</div>
				</form>
			</div>
		</SessionContext.Provider>
	);
}