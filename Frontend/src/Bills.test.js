import { render, waitFor, screen } from "@testing-library/react";
import BillsList from "./components/Bills/BillsList";

jest.mock("axios");

const dummyTodos = [
    {
        id: 1,
        name: 'bill1',
        amount:1000,
        billDate:new Date(),
        repeats:'Monthly',
        dueDate: new Date(),
        paid: false,
        email: 'ooha@gmail.com'
    },
    {
        id: 2,
        name: 'bill2',
        amount:4000,
        billDate:new Date(),
        repeats:'Half Yearly',
        dueDate: new Date(),
        paid: false,
        email: 'ooha2@gmail.com'
    },
    {
        id: 3,
        name: 'bill3',
        amount:4500,
        billDate:new Date(),
        repeats:'Yearly',
        dueDate: new Date(),
        paid: false,
        email: 'ooha3@gmail.com'
    },
];

it("bills list", async () => {
axios.get.mockResolvedValue({ data: dummyTodos });
render(<BillsList />);

const billsList = await waitFor(() => screen.findAllByTestId("bill"));

expect(billsList).toHaveLength(3);
});