import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import PropTypes from 'prop-types';

const JudgesTable = ({ judges, onEdit, onDelete }) => {
  return (
    <Box overflowX="auto">
      <Table variant="striped" colorScheme="gray">
        <Thead bg="gray.100">
          <Tr>
            <Th>ID Number</Th>
            <Th>Name</Th>
            <Th>Expertise</Th>
            <Th>Email</Th>
            <Th>Current Load</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {judges.map((judge, index) => (
            <Tr key={index}>
              <Td>{judge.idNumber}</Td>
              <Td>{judge.name}</Td>
              <Td>{judge.expertise}</Td>
              <Td>{judge.email}</Td>
              <Td>{judge.currentLoad}</Td>
              <Td>
                <IconButton
                  aria-label="Edit Judge"
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="gray.100"
                  onClick={() => onEdit(judge.id)}
                  mr={2}
                />
                <IconButton
                  aria-label="Delete Judge"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="gray.100"
                  onClick={() => onDelete(judge.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

JudgesTable.propTypes = {
    judges: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        idNumber: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        expertise: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        currentLoad: PropTypes.string.isRequired,
      })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

export default JudgesTable;
