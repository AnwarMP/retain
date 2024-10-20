import React, { useEffect, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { Link } from 'react-router-dom';
import '../Styles/Signup.css';
import '../Styles/Universal.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { IoReturnUpBack } from "react-icons/io5";

const Home = () => {
  // State containing courses and their lectures
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseName, setCourseName] = useState(""); // Add state to capture course name

  const navigate = useNavigate();

  const email = localStorage.getItem('current_user_email'); // Adjust based on how you're storing email

  const handleCreateCourse = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await fetch('http://localhost:3000/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          course_name: courseName, // Send the course name to the backend
        }),
      });

      if (response.ok) {
        const newCourse = await response.json();
        setCourses([...courses, newCourse]); // Add the new course to the state
        setIsModalOpen(false); // Close the modal
        setCourseName(''); // Clear the input field
      } else {
        console.error('Failed to create course');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      // Get the logged-in user's email from localStorage
      const store_email = localStorage.getItem('current_user_email'); // Adjust based on how you're storing email

      if (!store_email) {
        console.error('No user email found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/courses/${store_email}`); // Adjust the URL if necessary
        const data = await response.json();
        setCourses(data); // Store the courses in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false); // In case of error, stop loading as well
      }
    };

    fetchCourses(); // Call the function
  }, []); // Empty dependency array to fetch courses only once when component mounts

  const handleCourseClick = (courseId) => {
    localStorage.setItem('course_id', courseId);
    navigate('/Lecture');

  };

  return (
    <div>
      <Header />
      {/* Courses cards */}
      <div className='p-10 m-10 grid grid-cols-3 gap-4'>
        {loading ? (
          // While loading, display empty divs with the glow effect
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`bg-white shadow-lg rounded-lg p-6 glow-effect`}>
              <h2 className='text-xl font-semibold mb-2'>Loading...</h2>
              <p className='text-gray-500'>Loading course data...</p>
            </div>
          ))
        ) : courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} className='bg-white shadow-lg rounded-lg p-6'>
              <h2 className='text-xl font-semibold mb-2'>{course.course_name}</h2>
              <p className='text-gray-500'>Created on: {new Date(course.created_date).toLocaleDateString()}</p>
              <div
                onClick={() => handleCourseClick(course.course_id)}
                className='text-blue-500 underline'>
                View Course
              </div>
            </div>
          ))
        ) : (
          <div>Add your first course.</div>
        )}
        {/* Add new course card */}
        <div id="add-new"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-100 shadow-lg rounded-lg p-6 flex justify-center items-center hover:bg-blue-500 group transition-colors duration-300">
          <IoIosAddCircle className="text-blue-500 text-6xl group-hover:text-white transition-colors duration-300" />
        </div>
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-10 rounded shadow-lg max-w-lg w-full'>
            <h1 className='text-3xl font-bold mb-4'>Add Course</h1>
            <p className='text-gray-600 mb-6'>
              Create a new course by entering the course name below.
            </p>
            <form onSubmit={handleCreateCourse}>
              <div className='mb-4'>
                <input
                  type='text'
                  name='courseName'
                  value={courseName} // Controlled input for course name
                  onChange={(e) => setCourseName(e.target.value)} // Update state on change
                  className='w-full px-3 py-2 border rounded'
                  placeholder='Course name'
                  required
                />
              </div>
              <div className='flex justify-end'>
                <button
                  type='button'
                  className='mr-4 px-4 py-2 bg-gray-500 text-white rounded'
                  onClick={() => setIsModalOpen(false)} // Close modal on cancel
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

export default Home;
