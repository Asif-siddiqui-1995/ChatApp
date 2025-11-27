import {createSlice} from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import {toast} from "react-toastify";

const initialState = {
    isLoading: false,
    error: null,
    token: null,
    user: {},
    isLoggedIn: false,
};
const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setError(state, action) {
            state.error = action.payload;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        loginSuccess(state, action) {
            state.token = action.payload;
            state.isLoggedIn = true;
        },
        logoutSuccess(state, action) {
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});
export default slice.reducer;

const {setError, setLoading, loginSuccess, logoutSuccess} = slice.actions;

// register user

export function RegisterUser(formData, navigate) {
    return async (dispatch, getState) => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        const reqBody = {
            ...formData,
        };
        // Make Api Call
        await axios
            .post("/auth/signup", reqBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(function (response) {
                console.log(response);
                toast.success(response.data.message);
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setError(error));
                toast.error(error?.message || "Something went Wrong");
            })
            .finally(() => {
                dispatch(setLoading(false));
                if (!getState().auth.error) {
                    navigate(`/auth/verify?email=${formData.email}`);
                }
            });
    };
}

// Resend OTP

export function resendOTP(email) {
    return async (dispatch, getState) => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        //Make Api Call
        await axios
            .post(
                "/auth/resend-otp",
                {
                    email,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response.data);
                toast.success(response.data.success);
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setError(error));
                toast.error(error?.message || "Something went Wrong");
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };
}

// Verify OTP
export function VerifyOTP(formValue, navigate) {
    return async (dispatch, getState) => {
        await axios
            .post(
                "/auth/verify",
                {
                    ...formValue,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response.data);
                const {token, message} = response.data;
                dispatch(loginSuccess(token));

                toast.success(message || "Email Verified Successfully");
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setError(error));
                toast.error(error?.message || "Something went Wrong");
            })
            .finally(() => {
                dispatch(setLoading(false));
                if (getState().auth.error) {
                    navigate("/dashboard");
                }
            });
    };
}

// login user
export function LoginUser(formValue, navigate) {
    return async (dispatch, getState) => {
        await axios
            .post(
                "/auth/login",
                {
                    ...formValue,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response.data);
                const {token, message} = response.data;
                dispatch(loginSuccess(token));

                toast.success(message || "Login Successfully");
            })
            .catch(function (error) {
                console.log(error);
                dispatch(setError(error));
                toast.error(error?.message || "Something went Wrong");
            })
            .finally(() => {
                dispatch(setLoading(false));
                if (getState().auth.error) {
                    navigate("/dashboard");
                }
            });
    };
}

export function LogoutUser(navigate) {
    return async (dispatch, getState) => {
        try {
            dispatch(logoutSuccess());
            navigate("/");
            toast.success("Logged Out Sucessfully");
        } catch (error) {
            console.log(error);
        }
    };
}
