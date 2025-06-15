import type { NextPage } from 'next';
import Image from "next/image";
import styles from './index.module.css';
import { useCallback } from 'react';
import PageWrapper from './components/PageWrapper';


const LoginPage1:NextPage = () => {
    return (
        <PageWrapper>
            <div className={styles.loginPage1}>
                <div className={styles.loginPage1Child} />
                <Image className={styles.maskGroupIcon} width={596} height={483} sizes="100vw" alt="" src="/images/login-page-1.png" />
            </div>
        </PageWrapper>
        );
    };

const LoginPage2:NextPage = () => {
    return (
        <div className={styles.loginPage2}>
            <div className={styles.loginPage2Child} />
            <Image className={styles.maskGroupIcon} width={1187} height={799} sizes="100vw" alt="" src="/images/login-page-2.png" />
        </div>);
    };

const LoginPage3:NextPage = () => {
    return (
        <div className={styles.loginPage3}>
            <div className={styles.loginPage3Child} />
            <Image className={styles.maskGroupIcon} width={1187} height={970} sizes="100vw" alt="" src="/images/login-page-3.png" />
        <b className={styles.amenity}>Amenity</b>
    </div>);
};

const LoginPage13:NextPage = () => {
    
    const onLoginButtonClick = useCallback(() => {
    // Add your code here
    }, []);
    
    return (
        <div className={styles.loginPage13}>
            <div className={styles.loginPage13Child} />
            <Image className={styles.maskGroupIcon} width={1187} height={970} sizes="100vw" alt="" src="/images/login-page-13.png" />
            <div className={styles.wrapperLoginButton}>
                <Image className={styles.loginButtonIcon} width={64} height={55} sizes="100vw" alt="" src="login button.svg" onClick={onLoginButtonClick} />
            </div>
            <b className={styles.amenity}>Amenity</b>
        </div>);
};

const LoginPage4:NextPage = () => {
    return (
        <div className={styles.loginPage4}>
        <div className={styles.loginPage4Child} />
        <Image className={styles.maskGroupIcon} width={1921} height={1001} sizes="100vw" alt="" src="/images/login-page-4.png" />
        <div className={styles.loginPage4Inner}>
            <div className={styles.usernameParent}>
                <div className={styles.username}>
                    <Image className={styles.usernameChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                    <div className={styles.emailAdress}>Username</div>
                </div>
                <div className={styles.createAcc}>
                    <Image className={styles.createAccChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                    <div className={styles.createAcccount}>Create Acccount</div>
                </div>
                <div className={styles.logIn}>
                    <Image className={styles.createAccChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                    <div className={styles.logIn1}>Log In</div>
                </div>
                <div className={styles.emailAddress}>
                    <Image className={styles.usernameChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                    <div className={styles.emailAdress}>Email Adress</div>
                </div>
                <div className={styles.password}>
                    <Image className={styles.passwordChild} width={320} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                    <div className={styles.emailAdress}>Password</div>
                </div>
                <div className={styles.confirmPassword}>
                    <Image className={styles.passwordChild} width={320} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                    <div className={styles.confirmPassword1}>Confirm Password</div>
                </div>
                <div className={styles.or}>
                    <div className={styles.orChild} />
                    <div className={styles.orItem} />
                    <div className={styles.or1}>Or</div>
                </div>
            </div>
        </div>
    </div>);
};
const LoginPage5:NextPage = () => {
  	return (
    <div className={styles.loginPage5}>
        <div className={styles.loginPage5Child} />
        <Image className={styles.maskGroupIcon} width={1921} height={1001} sizes="100vw" alt="" src="/images/login-page-5.png" />
        <div className={styles.groupParent}>
                <div className={styles.lineParent}>
                    <Image className={styles.groupChild} width={668} height={0.6} sizes="100vw" alt="" src="Line 5.svg" />
                    <div className={styles.alreadyHaveAn}>{`Already have an account? `}</div>
                </div>
                <div className={styles.usernameParent}>
                    <div className={styles.username}>
                            <Image className={styles.usernameChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                            <div className={styles.username1}>Username</div>
                    </div>
                    <div className={styles.emailAddress}>
                            <Image className={styles.usernameChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                            <div className={styles.emailAddress1}>Email Address</div>
                    </div>
                    <div className={styles.password}>
                            <Image className={styles.passwordChild} width={320} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                            <div className={styles.username1}>Password</div>
                    </div>
                    <div className={styles.confirmPassword}>
                            <Image className={styles.confirmPasswordChild} width={329} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                            <div className={styles.confirmPassword1}>Confirm Password</div>
                    </div>
                </div>
                <div className={styles.signUp}>Sign Up</div>
                <div className={styles.loginButton}>
                    <div className={styles.login}>Login</div>
                </div>
        </div>
        <div className={styles.signUp1}>
                <div className={styles.signUp2}>
                    <Image className={styles.signUpChild} width={189} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
                    <div className={styles.signUp3}>Sign Up</div>
                </div>
        </div>
    </div>);
};
const LoginPage14:NextPage = () => {
  	return (
    		<div className={styles.loginPage14}>
      			<div className={styles.loginPage14Child} />
      			<Image className={styles.maskGroupIcon} width={1921} height={1001} sizes="100vw" alt="" src="/images/login-page-14.png" />
      			<div className={styles.username}>
        				<div className={styles.emailAddress}>
          					<Image className={styles.usernameChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
          					<div className={styles.username2}>Username</div>
        				</div>
        				<Image className={styles.user3FillIcon} width={33} height={34} sizes="100vw" alt="" src="user-3-fill.svg" />
      			</div>
      			<div className={styles.rememberMe}>
        				<div className={styles.rememberMe1}>Remember me</div>
        				<Image className={styles.vectorIcon} width={22} height={22.8} sizes="100vw" alt="" src="Vector.svg" />
        				<div className={styles.checkboxBlankLine} />
      			</div>
      			<div className={styles.password}>
        				<div className={styles.emailAddress}>
          					<Image className={styles.usernameChild} width={668} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
          					<div className={styles.password1}>Password</div>
        				</div>
        				<Image className={styles.lock2LineIcon} width={36} height={35} sizes="100vw" alt="" src="lock-2-line.svg" />
        				<Image className={styles.eyeOffFillIcon} width={31} height={28} sizes="100vw" alt="" src="eye-off-fill.svg" />
      			</div>
      			<div className={styles.logIn}>Log In</div>
      			<div className={styles.forgotPassword}>
        				<div className={styles.forgotPassword1}>Forgot Password?</div>
          					</div>
          					<div className={styles.logIn1}>
            						<div className={styles.logIn2}>
              							<Image className={styles.logInChild} width={189} height={75} sizes="100vw" alt="" src="Rectangle 1.svg" />
              							<div className={styles.logIn3}>Log In</div>
            						</div>
          					</div>
          					<div className={styles.loginButton}>
            						<div className={styles.signUp}>Sign Up</div>
          					</div>
          					<div className={styles.lineParent}>
            						<Image className={styles.groupChild} width={668} height={0.6} sizes="100vw" alt="" src="Line 5.svg" />
            						<div className={styles.dontHaveAn}>Don’t have an account?</div>
              							</div>
              							</div>);
            						};
            						
export default LoginPage1;
export { LoginPage2 };
export { LoginPage3 };
export { LoginPage13 };
export { LoginPage4 };
export { LoginPage5 };
export { LoginPage14 };