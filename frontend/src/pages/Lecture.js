import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Signup.css'; 
import '../Styles/Universal.css';
import Header from '../components/Header';
import '../Styles/Lecture.css'; 

const Lecture = () => {
  //modal state for creating a new lecture
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to store the selected file name
  const [selectedFileName, setSelectedFileName] = useState('');

  // State containing courses and their lectures
  const [courses, setCourses] = useState({
    course1: {
      lectures: [
        { name: 'Introduction to React', createdDate: '2024-10-10' },
        { name: 'Components in React', createdDate: '2024-10-12' },
        { name: 'State and Props', createdDate: '2024-10-14' },
        { name: ' Props', createdDate: '2024-9-14' },
      ]
    },
    course2: {
      lectures: [
        { name: 'Advanced JavaScript', createdDate: '2024-09-10' },
        { name: 'Asynchronous JS', createdDate: '2024-09-12' }
      ]
    }
    // Add more courses as needed
  });

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(`${file.name}`);
    }
  };

  // Select the current course (for demo, we hardcode 'course1')
  const currentCourse = courses.course1; // Replace this with logic to pick the course

  // Function to handle form submission
  const handleCreateLecture = (e) => {
    e.preventDefault();
    
    const newLectureName = e.target.elements.lectureName.value;
    const newLectureDate = new Date().toISOString().split('T')[0];
    
    // Optional: Access the uploaded file if needed
    const uploadedFile = e.target.elements.fileInput.files[0]; 
    if (uploadedFile) {
      console.log('Uploaded file:', uploadedFile); // You can handle the file here
    }
  
    // Update the courses state immutably
    setCourses((prevCourses) => ({
      ...prevCourses,
      course1: {
        ...prevCourses.course1,
        lectures: [...prevCourses.course1.lectures, { name: newLectureName, createdDate: newLectureDate }],
      },
    }));
  
    // Close the modal and reset selected file
    setIsModalOpen(false);
    setSelectedFileName('');
  };

  return (
    <div>
      <Header />

      {/* Lecture cards */}
      <div className='p-10 m-10 grid grid-cols-3 gap-4'>
        {currentCourse.lectures.map((lecture, index) => (
          <div key={index} className='bg-white shadow-lg rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-2'>{lecture.name}</h2>
            <p className='text-gray-500'>Created on: {lecture.createdDate}</p>
            <Link to={`/lecture/${index}`} className='text-blue-500 underline'>
              View Lecture
            </Link>
          </div>
        ))}

          {/* Create a Lecture card */} 
        <div
          key='create-lecture'
          className='bg-white shadow-lg rounded-lg p-6 flex items-center justify-center cursor-pointer'
          onClick={() => setIsModalOpen(true)} //create lecture modal set to false till clicked
        >
          <h2 className='text-xl font-semibold mb-2'>Create a Lecture</h2>
        </div>
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-10 rounded shadow-lg max-w-lg w-full'>
            <h1 className='text-3xl font-bold mb-4'>Add Sources</h1>
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
                  onClick={() => {setIsModalOpen(false); setSelectedFileName('');}}
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
