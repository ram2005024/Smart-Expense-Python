import { useContext, useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Auth from '../context/AuthProvider';
import React from 'react';
export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login, register } = useContext(Auth);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password1: '',
        password2: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Login successful!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setFormData({ username: '', email: '', password: '', password1: '', password2: '' });
                navigate('/dashboard');
            } else {
                // Validate passwords match on frontend
                if (formData.password1 !== formData.password2) {
                    setErrors({ password2: ['Passwords do not match'] });
                    toast.error('Passwords do not match!', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                    setLoading(false);
                    return;
                }

                await register(formData.username, formData.email, formData.password1, formData.password2);
                toast.success('Registration successful! Please login.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setFormData({ username: '', email: '', password: '', password1: '', password2: '' });
                setIsLogin(true);
            }
        } catch (error) {
            console.log('Error:', error);

            // Handle API response errors
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                // Check if errors are field-specific (from serializer)
                if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                    setErrors(errorData);

                    // Show toast for first error
                    const firstErrorKey = Object.keys(errorData)[0];
                    const firstErrorMsg = Array.isArray(errorData[firstErrorKey])
                        ? errorData[firstErrorKey][0]
                        : errorData[firstErrorKey];

                    toast.error(firstErrorMsg || 'An error occurred', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                } else {
                    // Generic error message
                    const message = errorData.detail || errorData.message || 'An error occurred';
                    toast.error(message, {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                }
            } else {
                toast.error(error.message || 'An unexpected error occurred', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ username: '', email: '', password: '', password1: '', password2: '' });
        setShowPassword(false);
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main card */}
            <div className="relative w-full max-w-md">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative h-full flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    {isLogin ? 'Welcome Back' : 'Join Us'}
                                </h1>
                                <p className="text-blue-100 text-sm">
                                    {isLogin ? 'Sign in to your account' : 'Create your account'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form container */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username field - Register only */}
                            {!isLogin && (
                                <div
                                    className="transform transition-all duration-300 origin-top"
                                    style={{
                                        opacity: isLogin ? 0 : 1,
                                        maxHeight: isLogin ? '0px' : 'auto',
                                    }}
                                >
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className={`w-full bg-slate-50 border rounded-lg pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.username
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                                                }`}
                                            required={!isLogin}
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.username) ? errors.username[0] : errors.username}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className={`w-full bg-slate-50 border rounded-lg pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                                            }`}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password field - Login only */}
                            {isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className={`w-full bg-slate-50 border rounded-lg pl-10 pr-12 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                                                }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Password1 and Password2 fields - Register only */}
                            {!isLogin && (
                                <div className="space-y-5">
                                    <div
                                        className="transform transition-all duration-300 origin-top"
                                        style={{
                                            opacity: isLogin ? 0 : 1,
                                            maxHeight: isLogin ? '0px' : 'auto',
                                        }}
                                    >
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password1"
                                                value={formData.password1}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className={`w-full bg-slate-50 border rounded-lg pl-10 pr-12 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.password1
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                                                    }`}
                                                required={!isLogin}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password1 && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {Array.isArray(errors.password1) ? errors.password1[0] : errors.password1}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className="transform transition-all duration-300 origin-top"
                                        style={{
                                            opacity: isLogin ? 0 : 1,
                                            maxHeight: isLogin ? '0px' : 'auto',
                                        }}
                                    >
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password2"
                                                value={formData.password2}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className={`w-full bg-slate-50 border rounded-lg pl-10 pr-12 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.password2
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                                                    }`}
                                                required={!isLogin}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password2 && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {Array.isArray(errors.password2) ? errors.password2[0] : errors.password2}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Forgot password - Login only */}
                            {isLogin && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Toggle mode */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button
                                    onClick={toggleMode}
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                >
                                    {isLogin ? 'Register' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom decoration */}
                <div className="mt-6 text-center text-slate-500 text-sm">
                    <p>Secure authentication with end-to-end encryption</p>
                </div>
            </div>
        </div>
    );
}