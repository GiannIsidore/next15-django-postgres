'use client'
import { useEffect, useState } from "react";

interface Book {
    id: number;
    title: string;
    release_year: number;
}

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [title, setTitle] = useState<string>('');
    const [release_year, setReleaseYear] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/books/');
            const data = await res.json();
            setBooks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addBook = async () => {
        const bookData = { title, release_year };
        try {
            const response = await fetch('http://127.0.0.1:8000/api/books/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData),
            });
            const data = await response.json();
            setBooks((prev) => [...prev, data]);
        } catch (error) {
            console.error(error);
        }
    };

    const openDialog = (book: Book) => {
        setSelectedBook(book);
        setTitle(book.title);
        setReleaseYear(book.release_year);
        setIsModalOpen(true);
    };

    const closeDialog = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
        setTitle('');
        setReleaseYear(0);
    };

    const updateBook = async () => {
        if (selectedBook) {
            const updatedData = { title, release_year };
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/books/${selectedBook.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData),
                });
                const updatedBook = await response.json();
                setBooks((prev) => prev.map((book) => (book.id === selectedBook.id ? updatedBook : book)));
                closeDialog();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const deleteBook = async () => {
        if (selectedBook) {
            try {
                await fetch(`http://127.0.0.1:8000/api/books/${selectedBook.id}`, {
                    method: 'DELETE',
                });
                setBooks((prev) => prev.filter((book) => book.id !== selectedBook.id));
                closeDialog();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="text-center font-sans text-gray-800 w-full h-full">
            <h1 className="text-5xl my-5">Books Website</h1>
            <div className="my-5">
                <input
                    type="text"
                    placeholder="Book Title"
                    className="p-2 m-1 rounded border border-gray-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Release Year"
                    className="p-2 m-1 rounded border border-gray-300"
                    value={release_year}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                />
                <button
                       type="button"
                    className="p-2 px-4 m-1 rounded bg-blue-500 text-white border-none cursor-pointer"
                    onClick={addBook}
                >
                    Add Book
                </button>
            </div>
            <div>
                <table className="table-auto w-full my-5">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Release Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr
                                key={book.id}
                                className="cursor-pointer hover:bg-gray-200"
                                onClick={() => openDialog(book)}
                            >
                                <td className="border px-4 py-2">{book.title}</td>
                                <td className="border px-4 py-2">{book.release_year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded shadow-md">
                        <h2 className="text-xl mb-4">Edit Book</h2>
                        <input
                            type="text"
                            placeholder="Book Title"
                            className="p-2 m-1 rounded border border-gray-300 w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Release Year"
                            className="p-2 m-1 rounded border border-gray-300 w-full"
                            value={release_year}
                            onChange={(e) => setReleaseYear(Number(e.target.value))}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="p-2 px-4 m-1 rounded bg-green-500 text-white border-none cursor-pointer"
                                onClick={updateBook}
                            >
                                Update
                            </button>
                            <button
                                   type="button"
                                className="p-2 px-4 m-1 rounded bg-red-500 text-white border-none cursor-pointer"
                                onClick={deleteBook}
                            >
                                Delete
                            </button>
                            <button
                                   type="button"
                                className="p-2 px-4 m-1 rounded bg-gray-300 text-black border-none cursor-pointer"
                                onClick={closeDialog}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
