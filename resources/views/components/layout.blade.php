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

<body class="font-poppins font-display min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-gray-200">
    <nav class="top-0 z-50 bg-black">
        <div class="flex h-16 flex-row">
            <div class="relative -mt-1 h-24 w-24 flex-none p-2 md:h-32 md:w-32">
                <a href="/">
                    <img src="/img/logo-round.svg" alt="Firecrackers of Central Ohio Logo" />
                </a>
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
