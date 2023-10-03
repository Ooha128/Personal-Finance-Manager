import { render, screen } from '@testing-library/react';
import App from './App';
import axios from "axios";

jest.mock("axios");

test('Login Page renders', () => {
  render(<App />);
  const btns = screen.getAllByRole('Button');
  expect(btns.length).toBe(1);
});
