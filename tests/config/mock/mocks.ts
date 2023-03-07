import { ObjectId } from "mongodb";

export const CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION = {
  name: "Make new relatory",
  responsables: ["Jose"]
};

export const SUB_PROCESS = [
  {
    name: "get social security",
    responsables: ["carlos", "romero"],
    requiredDocumentation: ["calling protocol"],
    description: "call to social security and provide the protocol number"
  }
];

export const CREATE_SUBPROCESS_MOCK = {
  name: "get documents to authentication",
  responsables: ["carlos", "romero"],
  description: "it needs to be done as soon as possible",
  departamentId: "6405ee50958ef4c30eb9d0a0",
  processId: "640634318365384217b89203",
  status: "doing"
};

export const CREATE_PROCESS_WITH_SUBPROCESS_AND_SUBPROCESS_WITH_DESCRIPTION = {
  name: "Make new relatory",
  responsables: ["Jose"],
  requiredDocumentation: ["ID", "Social Security"],
  subprocess: SUB_PROCESS
};

export const CREATE_DEPARTAMENT = {
  name: "Juridic",
  chief: "John Doe",
  team: ["Anderson", "Armando", "Hector"]
};

export const DESCRIPTION_WITH_EXCEDED_LENGTH = `Lorem ipsum dolor sit amet. Et impedit rerum aut accusamus fuga ea cumque nihil non quia neque. Rem sunt dolor in praesentium omnis aut tempore enim. Ut quaerat illo aut quia galisum non odio vitae et harum dolores sit dolore quisquam et veniam excepturi.
Ut nihil repellat qui modi quia et quia cupiditate sit recusandae autem ad minima consequatur et quia officia est voluptatum eaque. Qui impedit optio est voluptas dolore aut nihil labore et maiores ducimus? Aut vero molestiae ut nobis nesciunt aut magni veniam ut sint neque sed rerum rerum non laborum quod. Sed harum dolorem non quibusdam amet ut beatae debitis in alias earum qui libero aspernatur est dignissimos sint sed expedita ullam.
33 laborum tempore ut assumenda fugiat a facere vitae aut beatae harum ut enim vitae nam commodi facilis. Est voluptas libero vel galisum perspiciatis qui officia tenetur ad suscipit dolorem ut deleniti omnis est porro architecto ut suscipit magni.
Lorem ipsum dolor sit amet. Et quas debitis non voluptas saepe a esse ratione aut blanditiis dolor est dolor quia aut rerum nulla. Est debitis dolorum et voluptates nihil et odit vero qui suscipit facere quo ullam possimus!
Est expedita architecto ut laborum galisum et aperiam voluptatem. Ab error molestiae aut earum blanditiis et dolores nobis ut rerum debitis non numquam unde. Et sint perspiciatis At voluptatum voluptas et repellat voluptatem et delectus consequatur.
Ut modi iste id numquam minima et dicta numquam nam eveniet cupiditate ut impedit voluptas. Sit nisi obcaecati ut rerum molestiae et laboriosam aliquid.
Lorem ipsum dolor sit amet. Aut quasi enim et magnam quasi in voluptas odit est quidem dolores. Ut voluptatem suscipit ut consequuntur quia aut ducimus sunt? Ea maxime temporibus non obcaecati commodi et excepturi magni.
Qui nesciunt minima qui magni reiciendis est quaerat sapiente et dolorem maxime aut provident magnam qui ipsa saepe vel consequatur velit. Aut accusantium dolor et optio fuga et quam eaque. Id consequatur dolorem qui galisum saepe rem quia perferendis.
Hic quia impedit est dolores doloremque a voluptatem maiores ut culpa quam. Est obcaecati maiores nam beatae eaque sit Quis mollitia eos molestiae totam aut pariatur quia et molestiae nemo.`;

export const CREATE_DEPARTAMENT_RETURN_MOCK = {
  id: "640381faac89773044d6e1b3",
  name: "Juridic",
  team: ["Anderson", "Armando", "Hector"],
  chief: "John Doe",
  createdAt: new Date(`2023-03-04T17:38:02.768Z`),
  deletedAt: null,
  updatedAt: null
};

export const INTERNAL_SERVER_ERROR_MESSAGE =
  "Internal Server Error, see the logs to get more informations";

export const DEPARTAMENT_UPDATED_RESPONSE = {
  id: new ObjectId("6403776e7206b337b2aa1bcc"),
  name: "financial",
  team: ["Anderson", "Armando", "Hector"],
  chief: "John Doe",
  createdAt: new Date("2023-03-04T16:53:03.460Z"),
  deletedAt: null,
  updatedAt: new Date("2023-03-05T16:44:54.281Z")
};

export const FIND_MANY_DEPARTMENT_MOCKS = [
  {
    id: "6403776e7206b337b2aa1bcc",
    name: "financial",
    team: ["Anderson", "Armando", "Hector"],
    chief: "John Doe",
    createdAt: new Date("2023-03-04T16:53:03.460Z"),
    deletedAt: new Date(),
    updatedAt: new Date("2023-03-05T16:44:54.281Z")
  },
  {
    id: "640381faac89773044d6e1b3",
    name: "Juridic",
    team: ["Anderson", "Armando", "Hector"],
    chief: "John Doe",
    createdAt: new Date("2023-03-04T17:38:02.768Z"),
    deletedAt: new Date(),
    updatedAt: null
  },
  {
    id: "6404851e1aa4321286225311",
    name: "Juridic",
    team: ["Anderson", "Armando", "Hector"],
    chief: "John Doe",
    createdAt: new Date("2023-03-05T12:03:42.839Z"),
    deletedAt: null,
    updatedAt: null
  }
];

export const PROCESS_CREATED_MOCK = {
  id: "6406345e19cff05fd72230ef",
  name: "make new relatory",
  responsables: ["armando", "john"],
  requiredDocumentation: null,
  description: "call to social security office",
  status: "pending",
  processId: null,
  departamentId: "6405ee50958ef4c30eb9d0a0",
  createdAt: new Date("2023-03-06T18:43:43.063Z"),
  deletedAt: null,
  updatedAt: null
};

export const UPDATED_MANY_COUNT_MOCK = { count: 13 };
