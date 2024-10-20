import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Styles/Signup.css';
import '../Styles/Universal.css';
import Header from '../components/Header';
import '../Styles/Lecture.css';

const Lecture = () => {
  const { courseId } = useParams(); // Get the course ID from the URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loading, setLoading] = useState(true);
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
    const newLectureDate = new Date().toISOString().split('T')[0];
    const uploadedFile = e.target.elements.fileInput.files[0];
    const awsFolderLink = uploadedFile ? `path/to/aws/${uploadedFile.name}` : ''; // Example path to AWS

    // Create the lecture object
    const lectureData = {
      course_id: localStorage.getItem('course_id'),
      aws_folder_link: awsFolderLink,
      lecture_name: newLectureName,
      prompt: '', // Add any prompt data if needed
      transcript: '' // Add any transcript data if needed
    };

    // POST request to create a new lecture
    try {
      const response = await fetch('http://localhost:3000/create-lecture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lectureData),
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
              <Link to={`/lecture/${lecture.lecture_id}`} className='text-blue-500 underline'>
                View Lecture
              </Link>
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
    </div>
  );
};

export default Lecture;
