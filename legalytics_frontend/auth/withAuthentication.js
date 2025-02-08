// withAuthentication.js
import { useRouter } from "next/router";
import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

function withAuthentication(Component) {
    const AuthenticatedPage = (props) => {
        const [user, loading] = useAuthState(auth);
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push(`/login?r=${router.pathname}`);
            }
        }, [loading, user, router]);

        if (loading) {
            return <>Loading...</>;
        }

        return <Component {...props} />;
    };

    return AuthenticatedPage;
}

export default withAuthentication;