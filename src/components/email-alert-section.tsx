// components/EmailAlertSection.tsx

export default function EmailAlertSection() {

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // TODO: handle email submission (e.g., POST to backend)
  //   console.log("Email submitted:");
  // };

  return (
   
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // handle submission
      }}
      className="flex w-full max-w-xl rounded-lg overflow-hidden shadow-lg"
    >
      <input
        type="email"
        placeholder="Enter your email"
        required
        className="flex-grow px-4 py-3 text-black text-base focus:outline-none"
      />
      <button
        type="submit"
        className="bg-white text-[#2E7D32] p-3 flex items-center justify-center"
        aria-label="Submit email"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </form>


  );
}
