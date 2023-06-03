import React from "react";
import { toast } from "react-toastify";
import tw from "twin.macro";
import Loader from "../../components/Loader";
import axiosInstance from "../../services/api";

type TContact = {
  email: string;
  name: string;
  message: string;
  createdAt: Date;
  _id: string;
};

const Contact = () => {
  const [search, setSearch] = React.useState<string>("");
  const [contactUsList, setContactUsList] = React.useState<TContact[] | null>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [contactUsListSearch, setContactUsListSearch] = React.useState<
    TContact[] | null
  >();

  React.useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get<{ error: boolean; contactList: TContact[] }>("/contact")
      .then((response) => setContactUsList(response.data.contactList))
      .catch((error) => toast.error(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    const foundedFromContact = contactUsList?.filter((contact: TContact) =>
      contact.email.includes(search)
    );
    setContactUsListSearch(foundedFromContact);
  }, [search]);

  return (
    <Wrapper>
      <nav tw="flex bg-white items-center py-4 px-8 sticky top-0">
        <h3 tw="font-bold text-xl min-w-fit mr-5">Contact Us</h3>
        <input
          tw="rounded-lg w-full drop-shadow-lg bg-purple-800 text-white px-3 h-9"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </nav>
      <div tw="p-8 col-span-12">
        <table tw="w-full">
          <Thead>
            <Tr>
              <Th tw="w-2/12">Name</Th>
              <Th>Email</Th>
              <Th tw="w-4/12">Message</Th>
              <Th tw="w-2/12">Created At</Th>
            </Tr>
          </Thead>
          <tbody>
            {(contactUsList || contactUsListSearch) &&
              (search !== "" ? contactUsListSearch : contactUsList)?.map(
                (contact: TContact) => (
                  <Tr key={contact._id}>
                    <Td>{contact.name}</Td>
                    <Td>{contact.email}</Td>

                    <Td>{contact.message}</Td>
                    <Td>
                      {new Date(contact.createdAt).toLocaleString("en-US", {
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                      })}
                    </Td>
                  </Tr>
                )
              )}
          </tbody>
        </table>
      </div>
      <Loader isLoading={isLoading} />
    </Wrapper>
  );
};

const Wrapper = tw.div`col-span-10 bg-[#F4F7FE] h-screen relative overflow-y-auto`;

const Thead = tw.thead`border-[#F4F7FE] border-[5px] border-solid`;
const Th = tw.th`text-left py-3 bg-white px-1 first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;
const Tr = tw.tr`border-[#F4F7FE] border-[5px] border-solid`;
const Td = tw.td`py-2 px-1 bg-white first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;

export default Contact;
