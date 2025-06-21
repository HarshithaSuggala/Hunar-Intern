// Responsive Navigation Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// Courses Page: Dynamic Course Listing and Filtering
const courses = [
    {
        id: 'web-development',
        title: 'Complete Web Development Bootcamp',
        description: 'Master HTML, CSS, JavaScript, and modern frameworks to build responsive websites.',
        category: 'web-development',
        level: 'beginner',
        price: 99,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        duration: '12 weeks',
        students: '2.5k',
        rating: 4.8,
        paid: true
    },
    {
        id: 'data-science',
        title: 'Data Science & Machine Learning',
        description: 'Learn Python, statistics, and machine learning algorithms for data analysis.',
        category: 'data-science',
        level: 'intermediate',
        price: 149,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        duration: '16 weeks',
        students: '1.8k',
        rating: 4.9,
        paid: true
    },
    {
        id: 'digital-marketing',
        title: 'Digital Marketing Masterclass',
        description: 'Master SEO, social media marketing, and digital advertising strategies.',
        category: 'digital-marketing',
        level: 'all',
        price: 79,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        duration: '10 weeks',
        students: '3.2k',
        rating: 4.7,
        paid: true
    },
    {
        id: 'mobile-development',
        title: 'Mobile App Development',
        description: 'Build iOS and Android apps with React Native and Flutter.',
        category: 'mobile-development',
        level: 'intermediate',
        price: 129,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        duration: '14 weeks',
        students: '1.5k',
        rating: 4.6,
        paid: true
    }
];

function renderCourses(courseList) {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    if (courseList.length === 0) {
        grid.innerHTML = '<p>No courses found.</p>';
        return;
    }
    courseList.forEach(course => {
        grid.innerHTML += `
        <div class="course-card">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
                <div class="course-overlay">
                    <span class="course-level">${course.level.charAt(0).toUpperCase() + course.level.slice(1)}</span>
                </div>
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-users"></i> ${course.students} students</span>
                    <span><i class="fas fa-star"></i> ${course.rating}</span>
                </div>
                <div class="course-price">
                    <span class="price">${course.paid ? '$' + course.price : 'Free'}</span>
                    <a href="register.html" class="btn btn-primary">Enroll Now</a>
                </div>
            </div>
        </div>
        `;
    });
}

function filterCourses() {
    const search = document.getElementById('courseSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const level = document.getElementById('levelFilter')?.value || '';
    const price = document.getElementById('priceFilter')?.value || '';
    let filtered = courses.filter(course => {
        let match = true;
        if (search && !course.title.toLowerCase().includes(search) && !course.description.toLowerCase().includes(search)) match = false;
        if (category && course.category !== category) match = false;
        if (level && course.level !== level && !(level === 'all' && course.level === 'all')) match = false;
        if (price === 'free' && course.paid) match = false;
        if (price === 'paid' && !course.paid) match = false;
        return match;
    });
    renderCourses(filtered);
}

if (document.getElementById('coursesGrid')) {
    renderCourses(courses);
    document.getElementById('courseSearch')?.addEventListener('input', filterCourses);
    document.getElementById('categoryFilter')?.addEventListener('change', filterCourses);
    document.getElementById('levelFilter')?.addEventListener('change', filterCourses);
    document.getElementById('priceFilter')?.addEventListener('change', filterCourses);
}

// Registration Page: Course Selection and Payment Summary
const courseOptions = document.querySelectorAll('.course-option');
const selectedCourse = document.getElementById('selectedCourse');
const coursePrice = document.getElementById('coursePrice');
const processingFee = document.getElementById('processingFee');
const totalAmount = document.getElementById('totalAmount');
const enrollButton = document.getElementById('enrollButton');

if (courseOptions.length > 0) {
    courseOptions.forEach(option => {
        option.addEventListener('click', () => {
            courseOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            const name = option.querySelector('h3').textContent;
            const price = option.getAttribute('data-price');
            selectedCourse.textContent = name;
            coursePrice.textContent = `$${price}`;
            processingFee.textContent = `$${Math.round(price * 0.05)}`;
            totalAmount.textContent = `$${(parseFloat(price) + Math.round(price * 0.05)).toFixed(2)}`;
            enrollButton.disabled = false;
        });
    });
}

if (enrollButton) {
    enrollButton.addEventListener('click', () => {
        alert('Enrollment successful! Thank you for registering.');
        window.location.href = 'index.html';
    });
} 