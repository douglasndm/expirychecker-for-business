import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';

import { useAuth } from '@teams/Contexts/AuthContext';

import { captureException } from '@services/ExceptionsHandler';

import {
	isEmailConfirmed,
	resendConfirmationEmail,
} from '@teams/Functions/Auth/Account';

import Header from '@components/Header';
import Button from '@components/Button';

import {
	Container,
	Content,
	WaitingConfirmationEmail,
	EmailConfirmationExplain,
	ResendEmailText,
} from './styles';

const VerifyEmail: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { user } = useAuth();

	const [isMounted, setIsMounted] = useState<boolean>(true);
	const [isCheckLoading, setIsCheckLoading] = useState<boolean>(false);
	const [resendedEmail, setResendedEmail] = useState<boolean>(false);

	const animation = useMemo(() => {
		return require('~/Assets/Animations/email-animation.json');
	}, []);

	const handleCheckEmail = useCallback(async () => {
		if (!isMounted) return;
		try {
			setIsCheckLoading(true);
			const confirmed = await isEmailConfirmed();

			if (confirmed) {
				reset({ routes: [{ name: 'TeamList' }] });
			} else {
				showMessage({
					message: strings.View_ConfirmEmail_Error_EmailNotConfirmed,
					type: 'danger',
				});
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsCheckLoading(false);
		}
	}, [isMounted, reset]);

	const handleResendConfirmEmail = useCallback(async () => {
		try {
			setResendedEmail(true);
			await resendConfirmationEmail();
			showMessage({
				message: strings.View_ConfirmEmail_Alert_Success,
				type: 'info',
			});
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('auth/too-many-requests')) {
					setResendedEmail(false);
				} else {
					captureException({ error });
				}
			}
		}
	}, []);

	useEffect(() => {
		return () => {
			setIsMounted(false);
		};
	}, []);

	return (
		<Container>
			<Header title="Confirmação de e-mail" noDrawer />

			<Content>
				<LottieView
					source={animation}
					autoPlay
					loop
					style={{ width: 180, height: 180 }}
				/>

				<WaitingConfirmationEmail>
					{strings.View_ConfirmEmail_WaitingTitle}
				</WaitingConfirmationEmail>

				{!!user && user.email && (
					<EmailConfirmationExplain>
						{strings.View_ConfirmEmail_WaitingDescription.replace(
							'#{EMAIL}',
							user.email
						)}
					</EmailConfirmationExplain>
				)}

				<Button
					title={strings.View_ConfirmEmail_Button_Confirmed}
					isLoading={isCheckLoading}
					onPress={handleCheckEmail}
				/>

				{!resendedEmail && (
					<ResendEmailText onPress={handleResendConfirmEmail}>
						{strings.View_ConfirmEmail_ResendEmail}
					</ResendEmailText>
				)}
			</Content>
		</Container>
	);
};

export default VerifyEmail;
