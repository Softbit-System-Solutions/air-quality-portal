"use client"

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface FeedbackData {
    rating: number;
    feedback: string;
    email: string;
}

interface FeedbackSectionProps {
    onSubmitFeedback?: (data: FeedbackData) => Promise<void> | void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ onSubmitFeedback }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleStarClick = (starIndex: number): void => {
        setRating(starIndex);
    };

    const handleStarHover = (starIndex: number): void => {
        setHoveredRating(starIndex);
    };

    const handleSubmit = async (): Promise<void> => {
        if (rating > 0 && feedback.trim()) {
            setIsLoading(true);
            const feedbackData: FeedbackData = {
                rating,
                feedback: feedback.trim(),
                email: email.trim()
            };

            try {
                if (onSubmitFeedback) {
                    await onSubmitFeedback(feedbackData);
                } else {
                    console.log('Feedback submitted:', feedbackData);
                }
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setRating(0);
                    setFeedback('');
                    setEmail('');
                }, 3000);
            } catch (error) {
                console.error('Error submitting feedback:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        if (name === 'feedback') {
            setFeedback(value);
        } else if (name === 'email') {
            setEmail(value);
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

    return (
        <div className="max-w-6xl mx-auto py-36">

            {/* Feedback Section */}
            <div className='' >
                <div className="text-center ">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">We'd love to hear from you</h2>
                    <p className="text-gray-500 mb-16">Your feedback helps us improve our air quality monitoring service</p>

                </div>

                {isSubmitted ? (
                    <div className="max-w-md mx-auto text-center mb-6">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                            <h3 className="font-semibold">Thank you for your feedback!</h3>
                            <p className="text-sm mt-1">We appreciate your input and will use it to improve our service.</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto bg-white rounded-lg p-6 shadow-md space-y-10">
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                How would you rate our air quality service?
                            </label>
                            <div className="flex justify-left space-x-1">
                                {[1, 2, 3, 4, 5].map((star: number) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => handleStarHover(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="focus:outline-none transition-colors duration-200"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <Star
                                            size={32}
                                            className={`${star <= (hoveredRating || rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                } hover:text-yellow-400`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                {rating > 0 && (
                                    <span>
                                        {getRatingText(rating)}
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2">
                                Tell us about your experience
                            </label>
                            <textarea
                                id="feedback"
                                name="feedback"
                                value={feedback}
                                onChange={handleInputChange}
                                placeholder="Share your thoughts about our air quality monitoring service..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                                required
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {feedback.length}/500 characters
                            </p>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email (optional)
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || !feedback.trim() || isLoading}
                            className="w-full space-y-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 mt-4"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <Send size={18} />
                            )}
                            <span>{isLoading ? 'Submitting...' : 'Submit Feedback'}</span>
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default FeedbackSection;
