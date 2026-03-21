import { useState } from "react";
import UploadNoteForm from "../../components/upload/UploadNote";
import UploadQuestionForm from "../../components/upload/UploadQuestion";
import { useAuth } from "../../context/AuthContext";

const UploadPage = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="min-h-screen bg-background px-4 py-10 pt-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-10 px-2">
        <h1 className="text-3xl font-poppins text-textPrimary mb-4">
          Upload Study Material
        </h1>
        <p className="text-textSecondary font-inter">
          Share notes, PYQs, and study resources with others.
        </p>
      </div>

      {/* Buttons */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center mb-10">
        {(role === "cr" || role === "faculty") && (
          <button
            onClick={() =>
              setActiveForm(activeForm === "notes" ? null : "notes")
            }
            className="w-full sm:w-auto flex-1 bg-primary text-white py-3 rounded-md hover:bg-primaryDark transition"
          >
            Upload Notes
          </button>
        )}

        <button
          onClick={() =>
            setActiveForm(activeForm === "questions" ? null : "questions")
          }
          className="w-full sm:w-auto flex-1 bg-primary text-white py-3 rounded-md hover:bg-primaryDark transition"
        >
          Upload Questions
        </button>
      </div>

      {/* Forms */}
      <div className="mx-auto w-full px-2">
        <div className="grid grid-cols-1 gap-6">
          {/* Notes */}
          {(role === "cr" || role === "faculty") && activeForm === "notes" && (
            <div className="w-full bg-surface border border-borderSoft rounded-xl p-6">
              <UploadNoteForm />
            </div>
          )}

          {/* Questions */}
          {activeForm === "questions" && (
            <div className="w-full bg-surface border border-borderSoft rounded-xl p-6">
              <UploadQuestionForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
