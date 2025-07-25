"use client"

import React, { useState } from 'react';
import { Star, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface FeedbackData {
    rating: number;
    message: string;
    email: string;
    name: string;
}

interface FeedbackSectionProps {
    apiBaseUrl?: string; 
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ 
    apiBaseUrl = 'http://localhost:8000' 
}) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleStarClick = (starIndex: number): void => {
        setRating(starIndex);
        setError(''); // Clear any existing errors
    };

    const handleStarHover = (starIndex: number): void => {
        setHoveredRating(starIndex);
    };

    const submitFeedback = async (feedbackData: FeedbackData): Promise<void> => {
        const response = await fetch(`${apiBaseUrl}/api/feedback/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    };

    const handleSubmit = async (): Promise<void> => {
        if (rating > 0 && message.trim() && name.trim()) {
            setIsLoading(true);
            setError('');

            const feedbackData: FeedbackData = {
                rating,
                message: message.trim(),
                email: email.trim(),
                name: name.trim()
            };

            try {
                await submitFeedback(feedbackData);
                setIsSubmitted(true);
                
                // Reset form after 4 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                    setRating(0);
                    setMessage('');
                    setEmail('');
                    setName('');
                }, 4000);
            } catch (error) {
                console.error('Error submitting feedback:', error);
                setError(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('Please fill in all required fields');
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setError(''); // Clear errors when user starts typing
        
        if (name === 'message') {
            setMessage(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'name') {
            setName(value);
        }
    };

    const getRatingText = (rating: number): string => {
        const ratingTexts: { [key: number]: string } = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        return ratingTexts[rating] || '';
    };

    const isFormValid = rating > 0 && message.trim() && name.trim();

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            <div>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">We'd Love to Hear From You</h2>
                    <p className="text-gray-600 text-lg">Your feedback helps us improve our air quality monitoring service</p>
                </div>

                {/* Success Message */}
                {isSubmitted ? (
                    <div className="max-w-md mx-auto text-center">
                        <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-6 rounded-xl shadow-lg">
                            <CheckCircle size={48} className="mx-auto mb-3 text-green-600" />
                            <h3 className="font-bold text-lg">Thank You for Your Feedback!</h3>
                            <p className="text-sm mt-2">We appreciate your input and will use it to improve our air quality monitoring service.</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto bg-white rounded-xl p-8 shadow-xl border border-gray-200">
                        
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Rating Section */}
                        <div className="mb-8">
                            <label className="block text-gray-800 text-sm font-semibold mb-3">
                                How would you rate our air quality service? *
                            </label>
                            <div className="flex justify-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star: number) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => handleStarHover(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="focus:outline-none transition-all duration-200 transform hover:scale-110"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <Star
                                            size={36}
                                            className={`${star <= (hoveredRating || rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                } hover:text-yellow-400 transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-center text-base text-indigo-600 font-medium mt-3">
                                    {getRatingText(rating)}
                                </p>
                            )}
                        </div>

                        {/* Name Field */}
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-gray-800 text-sm font-semibold mb-2">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={handleInputChange}
                                placeholder="Enter your first and last name"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                                required
                            />
                        </div>

                        {/* Message Field */}
                        <div className="mb-6">
                            <label htmlFor="message" className="block text-gray-800 text-sm font-semibold mb-2">
                                Tell us about your experience *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={message}
                                onChange={handleInputChange}
                                placeholder="Share your thoughts about our air quality monitoring service..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors duration-200"
                                rows={4}
                                required
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">
                                    {message.length}/500 characters
                                </p>
                                {message.length > 450 && (
                                    <p className="text-xs text-amber-600">
                                        Character limit approaching
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="mb-8">
                            <label htmlFor="email" className="block text-gray-800 text-sm font-semibold mb-2">
                                Email (optional)
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                We'll only use this to follow up on your feedback if needed
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>Submit Feedback</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackSection;