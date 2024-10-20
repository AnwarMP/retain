import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Styles/Signup.css';
import '../Styles/Universal.css';
import Header from '../components/Header';
import '../Styles/Lecture.css';
import TextToSpeech from '../components/TextToSpeech';

const Lecture = () => {
  const { courseId } = useParams(); // Get the course ID from the URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null); // State for the selected lecture to display in modal
  const [lectures, setLectures] = useState([]); // Declare state for lectures

  useEffect(() => {
    const email = localStorage.getItem('current_user_email'); // Get email from localStorage
    const courseId = localStorage.getItem('course_id'); // Get course_id from localStorage

    if (email && courseId) {
      const fetchLectures = async () => {
        try {
          const response = await fetch(`http://localhost:3000/lectures/${email}/${courseId}`);
          const data = await response.json();
          setLectures(data); // Set fetched lectures in state
          setLoading(false); // Set loading to false after fetching
        } catch (error) {
          console.error('Error fetching lectures:', error);
          setLoading(false); // Ensure loading is set to false on error
        }
      };

      fetchLectures();
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(`${file.name}`);
    }
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    const newLectureName = e.target.elements.lectureName.value;
    const prompt = e.target.elements.prompt.value;
    const uploadedFile = e.target.elements.fileInput.files[0];

    if (!uploadedFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('course_id', localStorage.getItem('course_id'));
    formData.append('lecture_name', newLectureName);
    formData.append('prompt', prompt);
    formData.append('file', uploadedFile);

    // POST request to create a new lecture
    try {
      const response = await fetch('http://localhost:3000/create-lecture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create lecture');
      }

      const newLecture = await response.json();

      // Update the lectures state immutably
      setLectures((prevLectures) => [...prevLectures, newLecture]);

      // Close the modal and reset selected file
      setIsModalOpen(false);
      setSelectedFileName('');
    } catch (error) {
      console.error('Error creating lecture:', error);
      alert('error creating lecture');
      // Optionally, show an error message to the user
    }
  };

  // Show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />

      {/* Lecture cards */}
      <div className='p-10 m-10 grid grid-cols-3 gap-4'>
        {lectures.length > 0 ? (
          lectures.map((lecture) => (
            <div key={lecture.lecture_id} className='bg-white shadow-lg rounded-lg p-6'>
              <h2 className='text-xl font-semibold mb-2'>{lecture.lecture_name}</h2>
              <p className='text-gray-500'>Created on: {new Date(lecture.created_date).toLocaleDateString()}</p>
              <button
                onClick={() => setSelectedLecture(lecture)}
                className='text-blue-500 underline mt-2'
              >
                Listen to Lecture
              </button>
            </div>
          ))
        ) : (
          <div>No lectures available.</div>
        )}

        {/* Create a Lecture card */}
        <div
          className='bg-white shadow-lg rounded-lg p-6 flex items-center justify-center cursor-pointer'
          onClick={() => setIsModalOpen(true)} // create lecture modal set to false till clicked
        >
          <h2 className='text-xl font-semibold mb-2'>Create a Lecture</h2>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-10 rounded shadow-lg max-w-lg w-full'>
            <h1 className='text-3xl font-bold mb-4'>Add Lecture</h1>
            <p className='text-gray-600 mb-6'>
              Let Retain curate your lecture based on your sources!
              <br />
              (Notes, Research Papers, Lab Reports, Homework, etc.)
            </p>
            <form onSubmit={handleCreateLecture}>
              <div className='mb-4'>
                <input
                  type='text'
                  name='lectureName'
                  className='w-full px-3 py-2 border rounded'
                  placeholder='Lecture name'
                  required
                />
              </div>
              <div className='mb-4'>
                <input
                  type='text'
                  name='prompt'
                  className='w-full px-3 py-2 border rounded'
                  placeholder='Prompt'
                  required
                />
              </div>
              <div className='border-2 border-dashed border-gray-300 p-6 mb-6 flex justify-center items-center'>
                <input
                  type="file"
                  className="hidden"
                  id="fileInput"
                  name="fileInput"
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput" className='text-gray-500 cursor-pointer'>
                  {selectedFileName ? (
                    <span className='text-blue-500'>{selectedFileName}</span>
                  ) : (
                    <span>Drag & drop or <span className='text-blue-500'>choose file</span> to upload</span>
                  )}
                </label>
              </div>
              <div className='flex justify-end'>
                <button
                  type='button'
                  className='mr-4 px-4 py-2 bg-gray-500 text-white rounded'
                  onClick={() => { setIsModalOpen(false); setSelectedFileName(''); }}
                >
                  Cancel
                </button>
                <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded'>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal for Displaying Lecture Transcript */}
      {selectedLecture && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-8 rounded shadow-lg max-w-2xl w-full overflow-y-auto max-h-screen'>
            <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold'>
              {selectedLecture.lecture_name}
              <span className='text-xs text-gray-500 ml-2'>
                Created on: {new Date(selectedLecture.created_date).toLocaleDateString()}
              </span>
            </h2>
            </div>
            
            <h3 className='text-xl font-semibold mb-2'>Your Lecturer</h3>
            <TextToSpeech text={selectedLecture.transcript} />

            <div className='mb-6'>
              <h3 className='text-xl font-semibold '>Transcript</h3>
              <p className='text-gray-800 whitespace-pre-line'>{selectedLecture.transcript}</p>
            </div>
            <div className='mb-4'>
              <a
                href={selectedLecture.aws_folder_link}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 underline'
              >
                View Source PDF
              </a>
            </div>
            <div className='flex justify-end'>
              <button
                onClick={() => setSelectedLecture(null)}
                className='px-4 py-2 bg-gray-400 text-white rounded'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Lecture;
