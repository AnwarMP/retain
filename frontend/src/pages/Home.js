import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Signup.css';
import '../Styles/Universal.css';
import Header from '../components/Header';
// import '../Styles/Courses.css'; // Create a separate CSS file for courses, similar to lecture styles

const Home = () => {
  // State containing courses and their lectures
  const [courses] = useState({
    course1: {
      name: 'React Basics',
      lectures: [
        { name: 'Introduction to React', createdDate: '2024-10-10' },
        { name: 'Components in React', createdDate: '2024-10-12' },
        { name: 'State and Props', createdDate: '2024-10-14' },
      ]
    },
    course2: {
      name: 'Advanced JavaScript',
      lectures: [
        { name: 'Advanced JavaScript Concepts', createdDate: '2024-09-10' },
        { name: 'Asynchronous JS', createdDate: '2024-09-12' }
      ]
    }
    // Add more courses as needed
  });

  return (
    <div>
      <Header />

      {/* Courses cards */}
      <div className='p-10 m-10 grid grid-cols-3 gap-4'>
        {Object.keys(courses).map((courseKey, index) => {
          const course = courses[courseKey]; // Get the course object
          return (
            <div key={index} className='bg-white shadow-lg rounded-lg p-6'>
              <h2 className='text-xl font-semibold mb-2'>{course.name}</h2>
              <p className='text-gray-500'>Lectures: {course.lectures.length}</p>
              <Link to={`/course/${courseKey}`} className='text-blue-500 underline'>
                View Course
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
