
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Signup.css'; 
import '../Styles/Universal.css';
import Header from '../components/Header';
import '../Styles/Lecture.css'; 

const Article = () => {
  // State containing courses and their lectures
  const [courses] = useState({
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

  // Select the current course (for demo, we hardcode 'course1')
  const currentCourse = courses.course1; // Replace this with logic to pick the course

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
      </div>
    </div>
  );
};

export default Article;
