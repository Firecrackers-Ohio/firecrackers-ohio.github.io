<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/img/favicon.svg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Orbitron:wght@400..900&display=swap"
        rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <title>{{ isset($title) ? $title : 'FCOH' }}</title>
</head>

<body class="font-poppins font-display min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-gray-200" x-data="{ mobileMenuOpen: false }">

    <nav class="border-b-2 border-red bg-white dark:bg-gray-800">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <!-- Logo -->
            <div class="flex items-center">
                <a href="/" class="flex items-center">
                    <img src="/img/ohio-logo.svg" alt="Firecrackers Ohio Logo" class="h-12" />
                </a>
            </div>

            <!-- Desktop Navigation Links -->
            <div class="hidden items-center gap-8 md:flex">
                <a href="/" class="font-medium text-gray-900 transition hover:text-red dark:text-gray-200 dark:hover:text-red">Home</a>
                <a href="/about" class="font-medium text-gray-900 transition hover:text-red dark:text-gray-200 dark:hover:text-red">About</a>

                <!-- Teams Dropdown -->
                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" class="flex items-center gap-1 font-medium text-gray-900 transition hover:text-red dark:text-gray-200 dark:hover:text-red">
                        Teams
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div x-show="open" @click.outside="open = false" x-transition class="absolute left-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-700">
                        <div class="py-1">
                            <a href="/teams/tryouts" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">Tryouts</a>
                            <a href="/teams" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">All Teams</a>
                            <div class="my-1 border-t border-gray-200 dark:border-gray-600"></div>
                            <a href="/teams/10u" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">10U</a>
                            <a href="/teams/11u" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">11U</a>
                            <a href="/teams/12u" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">12U</a>
                            <a href="/teams/13u" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">13U</a>
                            <a href="/teams/14u" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">14U</a>
                        </div>
                    </div>
                </div>

                <a href="/store" class="font-medium text-gray-900 transition hover:text-red dark:text-gray-200 dark:hover:text-red">Store</a>
            </div>

            <!-- Social Media Icons & Mobile Menu Button -->
            <div class="flex items-center gap-4">
                <!-- Social Media Icons -->
                <div class="hidden items-center gap-4 md:flex">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-gray-900 transition hover:text-red dark:text-gray-200 dark:hover:text-red">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-gray-900 transition hover:text-red dark:text-gray-200 dark:hover:text-red">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a href="mailto:info@firecrackersohio.com" class="text-gray-900 transition hover:text-red dark:text-gray-200 dark:hover:text-red">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div x-show="mobileMenuOpen" x-transition class="border-t border-gray-200 dark:border-gray-700 md:hidden">
            <div class="space-y-1 px-4 py-3">
                <a href="/" class="block py-2 font-medium text-gray-900 dark:text-gray-200">Home</a>
                <a href="/about" class="block py-2 font-medium text-gray-900 dark:text-gray-200">About</a>

                <!-- Mobile Teams Dropdown -->
                <div x-data="{ teamsOpen: false }">
                    <button @click="teamsOpen = !teamsOpen" class="flex w-full items-center justify-between py-2 font-medium text-gray-900 dark:text-gray-200">
                        Teams
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div x-show="teamsOpen" x-transition class="space-y-1 pl-4">
                        <a href="/teams/tryouts" class="block py-2 text-sm text-gray-700 dark:text-gray-300">Tryouts</a>
                        <a href="/teams" class="block py-2 text-sm text-gray-700 dark:text-gray-300">All Teams</a>
                        <a href="/teams/10u" class="block py-2 text-sm text-gray-700 dark:text-gray-300">10U</a>
                        <a href="/teams/11u" class="block py-2 text-sm text-gray-700 dark:text-gray-300">11U</a>
                        <a href="/teams/12u" class="block py-2 text-sm text-gray-700 dark:text-gray-300">12U</a>
                        <a href="/teams/13u" class="block py-2 text-sm text-gray-700 dark:text-gray-300">13U</a>
                        <a href="/teams/14u" class="block py-2 text-sm text-gray-700 dark:text-gray-300">14U</a>
                    </div>
                </div>

                <a href="/store" class="block py-2 font-medium text-gray-900 dark:text-gray-200">Store</a>

                <!-- Mobile Social Media Icons -->
                <div class="flex gap-4 pt-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-gray-900 dark:text-gray-200">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-gray-900 dark:text-gray-200">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a href="mailto:info@firecrackersohio.com" class="text-gray-900 dark:text-gray-200">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    {{ $slot }}

    <footer class="border-red border-t-2 bg-gray-400 py-8 text-gray-900 dark:bg-gray-800 dark:text-gray-200">
        <div class="flex justify-center">
            <img src="/img/ohio-logo.svg" alt="Firecrackers Ohio Logo" class="h-16" />
        </div>
    </footer>

</body>

</html>
