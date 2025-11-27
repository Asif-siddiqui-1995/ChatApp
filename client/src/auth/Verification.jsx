import {Link, useLocation, useNavigate} from "react-router-dom";
import Logo from "../components/Logo";
import {useEffect, useRef, useState} from "react";

import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from "react-redux";
import {resendOTP, VerifyOTP} from "../redux/slices/auth";

// Schema
const otpSchema = yup.object().shape({
    otp: yup
        .array()
        .of(yup.string().matches(/^\d$/, "Must Be a Digit"))
        .length(4, "OTP Must Be exactly 4 digits")
        .required("OTP is required"),
});

export default function Verification() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // const [value, setValue] = useState("");
    const {isLoading} = useSelector((state) => state.auth);

    const {
        control,
        handleSubmit,
        getValues,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(otpSchema),
        defaultValues: {
            otp: ["", "", "", ""],
        },
    });
    const inputRef = useRef([]);
    const email = new URLSearchParams(location.search).get("email");
    const [resendDisabled, setResendDisabled] = useState(true);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (inputRef.current[0]) {
            inputRef.current[0].focus();
        }
    }, []);

    // timer effect for disabling the resend button
    useEffect(() => {
        if (resendDisabled) {
            const intervalId = setInterval(() => {
                setTimer((prev) => {
                    if (prev > 0) return prev - 1;
                    setResendDisabled(false);
                    return 0;
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [resendDisabled]);

    // const handleChangedInput = (e, index) => {
    //     const value = e.target.value;
    //     console.log(value);
    //     if (/^\d$/.test(value)) {
    //         // Valid Digit input
    //         setValue(`otp[${index}]`, value, {shouldValidate: true});
    //         if (index < 3) {
    //             inputRef.current[index - 1]?.focus();
    //         } else if (value === "") {
    //             setValue(`otp[${index}]`, "");
    //             if (
    //                 index > 0 &&
    //                 e.nativeEvent.inputType === "deleteContentBackward"
    //             ) {
    //                 inputRef.current[index - 1]?.focus();
    //             }
    //         }
    //     }
    // };
    const handleChangedInput = (e, index, onChange) => {
        const value = e.target.value;

        if (/^\d$/.test(value) || value === "") {
            onChange(value); // Correctly update form state

            if (value !== "" && index < 3) {
                inputRef.current[index + 1]?.focus();
            } else if (value === "" && index > 0) {
                inputRef.current[index - 1]?.focus();
            }
        }
    };

    const onSubmit = (data) => {
        const otp = data.otp.join(""); //Combine the 4 digits into 1 string
        try {
            dispatch(VerifyOTP({email, otp}, navigate));
        } catch (error) {
            console.log(error, "Verification Failed");
        }
    };

    const handleResendOtp = async () => {
        // Reset the timer and disabled the button
        setResendDisabled(true);
        setTimer(60);
        try {
            dispatch(resendOTP(email));
            console.log("OTP Resend Successfully!");
        } catch (error) {
            console.error("Error Resending OTP :", error);
        }
    };
    return (
        <div className="overflow-hidden px-4 dark:bg-boxdark-2 sm:px-8">
            <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
                <div className="no-scrollbar overflow-y-auto py-20">
                    <div className="mx-auto w-full max-w-[40] ">
                        <div className="text-center">
                            <Link to="/" className="mx-auto mb-10 inline-flex">
                                <Logo />
                            </Link>
                            <div className="bg-white p-4 shadow-14 rounded-xl dark:bg-boxdark lg:p-7.5 xl:p-12.5">
                                <h1 className="mb-2.5 text-3xl font-bold leading-[48px] text-black dark:text-white capitalize">
                                    Verify Your Account
                                </h1>
                                <p className="mb-7.5 font-medium">
                                    Enter your 4 digit code send to your email.
                                </p>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex items-center gap-4.5">
                                        {Array.from({length: 4}).map(
                                            (_, index) => (
                                                //
                                                <Controller
                                                    key={index}
                                                    name={`otp.${index}`}
                                                    control={control}
                                                    render={({field}) => (
                                                        <input
                                                            {...field}
                                                            ref={(el) =>
                                                                (inputRef.current[
                                                                    index
                                                                ] = el)
                                                            }
                                                            type="text"
                                                            maxLength="1"
                                                            className="w-20 rounded-md border-[1.5px] border-stroke bg-transparent px-5 py-3 text-center
            text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default
            disabled:bg-white dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                            value={field.value} // Ensure value is set correctly
                                                            onChange={(e) =>
                                                                handleChangedInput(
                                                                    e,
                                                                    index,
                                                                    field.onChange
                                                                )
                                                            }
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                        "Backspace" &&
                                                                    !field.value
                                                                ) {
                                                                    inputRef.current[
                                                                        index -
                                                                            1
                                                                    ]?.focus();
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            )
                                        )}
                                    </div>
                                    {errors.otp && (
                                        <p className="mt-2 text-red">
                                            {errors.otp.message}
                                        </p>
                                    )}
                                    <p
                                        className="mb-5 mt-4 text-left font-medium text-black dark:text-white space-x-2 flex 
                                    flex-row items-center"
                                    >
                                        <span>Didnot recieve the code?</span>
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={resendDisabled}
                                            className={
                                                resendDisabled
                                                    ? "text-body"
                                                    : "text-primary"
                                            }
                                        >
                                            Resend{" "}
                                            {resendDisabled && `(${timer}s)`}
                                        </button>
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isLoading || isSubmitting}
                                        className="flex w-full justify-center rounded-md bg-primary p-[13px] font-bold text-gray hover:bg-opacity-90"
                                    >
                                        {isLoading || isSubmitting
                                            ? "Submitting.."
                                            : "Verify"}
                                    </button>
                                    <span className="mt-5 block text-red">
                                        {`Don't share the verification code with
                                        anyone.`}
                                    </span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
