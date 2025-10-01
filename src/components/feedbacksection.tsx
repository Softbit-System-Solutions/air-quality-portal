"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Star, Send } from "lucide-react";
import { submitFeedback } from "@/lib/api";

interface FeedbackData {
  name: string;
  email: string;
  feedback: string; 
  rating: number;
}

const FeedbackSection = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FeedbackData>();

  const onSubmit = async (data: FeedbackData) => {
    if (rating === 0) {
      setError("rating", { type: "manual", message: "Please select a rating." });
      return;
    }

    setIsLoading(true);
    try {
      //feedback → message
      await submitFeedback({
        name: data.name,
        email: data.email,
        message: data.feedback,
        rating,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
        setRating(0);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("root", {
        type: "server",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingText = (r: number) =>
    ({
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    }[r] || "");

  return (
    <div className="max-w-6xl mx-auto pb-36">
      <div className="text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-2">
          We'd love to hear from you
        </h2>
        <p className="text-gray-500 mb-12">
          Your feedback helps us improve our air quality monitoring service
        </p>
      </div>

      {isSubmitted ? (
        <div className="max-w-md mx-auto text-center mb-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <h3 className="font-semibold">Thank you for your feedback!</h3>
            <p className="text-sm mt-1">
              We appreciate your input and will use it to improve our service.
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-xl mx-auto bg-white p-6 shadow-sm space-y-6 rounded-xl"
          noValidate
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required." })}
              type="text"
              placeholder="John Doe"
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
              type="email"
              placeholder="your.email@example.com"
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              How would you rate our air quality service?
            </label>
            <div className="flex justify-left space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    clearErrors("rating");
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    } hover:text-yellow-400`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
            {rating > 0 && (
              <p className="text-left text-sm text-gray-500 mt-2">
                {getRatingText(rating)}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2">
              Tell us about your experience
            </label>
            <textarea
              id="feedback"
              {...register("feedback", { required: "Feedback cannot be empty." })}
              placeholder="Share your thoughts about our air quality monitoring service..."
              className={`w-full px-3 py-2 border ${
                errors.feedback ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.feedback ? "focus:ring-red-500" : "focus:ring-blue-500"
              } resize-none`}
              rows={4}
              maxLength={500}
            />
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1">
                {errors.feedback.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {errors.root && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.root.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 flex items-center justify-center space-x-2 mt-4 transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send size={18} />
            )}
            <span>{isLoading ? "Submitting..." : "Submit Feedback"}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackSection;
