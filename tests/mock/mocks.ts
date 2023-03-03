export const CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION = {
  name: "Make new relatory",
  responsable: "Jose"
};

export const SUB_PROCESS = [
  {
    name: "get social security",
    responsable: "carlos",
    requiredDocumentation: ["calling protocol"],
    description: "call to social security and provide the protocol number"
  }
];

export const CREATE_PROCESS_WITH_SUBPROCESS_AND_SUBPROCESS_WITH_DESCRIPTION = {
  name: "Make new relatory",
  responsable: "Jose",
  requiredDocumentation: ["ID", "Social Security"],
  subprocess: SUB_PROCESS
};
