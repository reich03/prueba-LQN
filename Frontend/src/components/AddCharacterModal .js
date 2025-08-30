import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@apollo/client';
import { X, Plus, User } from 'lucide-react';
import { CREATE_PERSON } from '../graphql/mutations';
import { GET_ALL_PLANETS, GET_ALL_PEOPLE } from '../graphql/queries';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.95) 0%, 
    rgba(22, 33, 62, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border: 2px solid ${props => props.theme.colors.primary}50;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: 2px solid ${props => props.theme.colors.primary}50;
  color: ${props => props.theme.colors.primary};
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}20;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 15px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 15px ${props => props.theme.colors.primary}20;
  }

  option {
    background: rgba(26, 26, 46, 0.95);
    color: ${props => props.theme.colors.text};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: ${props => props.theme.colors.secondary};
  border: none;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.primary}50;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.primary}10;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const AddCharacterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    mass: '',
    hairColor: '',
    skinColor: '',
    eyeColor: '',
    birthYear: '',
    gender: '',
    homeworldId: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const { data: planetsData } = useQuery(GET_ALL_PLANETS, {
    variables: { first: 50 }
  });

  const [createPerson, { loading }] = useMutation(CREATE_PERSON, {
    onCompleted: (data) => {
      if (data.createPerson.success) {
        setSuccessMessage('Character created successfully!');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      } else {
        setErrors(data.createPerson.errors || {});
      }
    },
    onError: (error) => {
      setErrors({ general: error.message });
    },
    refetchQueries: [{ query: GET_ALL_PEOPLE, variables: { first: 100 } }]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      height: '',
      mass: '',
      hairColor: '',
      skinColor: '',
      eyeColor: '',
      birthYear: '',
      gender: '',
      homeworldId: ''
    });
    setErrors({});
    setSuccessMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }

    createPerson({
      variables: {
        name: formData.name,
        height: formData.height || null,
        mass: formData.mass || null,
        hair_color: formData.hairColor || null,
        skin_color: formData.skinColor || null,
        eye_color: formData.eyeColor || null,
        birth_year: formData.birthYear || null,
        gender: formData.gender || null,
        homeworld_id: formData.homeworldId || null
      }
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const planets = planetsData?.allPlanets?.edges?.map(edge => edge.node) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                <User size={24} />
                Add New Character
              </ModalTitle>
              <CloseButton
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter character name"
                  required
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Height (cm)</Label>
                <Input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g., 172"
                />
              </FormGroup>

              <FormGroup>
                <Label>Mass (kg)</Label>
                <Input
                  type="text"
                  name="mass"
                  value={formData.mass}
                  onChange={handleChange}
                  placeholder="e.g., 77"
                />
              </FormGroup>

              <FormGroup>
                <Label>Hair Color</Label>
                <Input
                  type="text"
                  name="hairColor"
                  value={formData.hairColor}
                  onChange={handleChange}
                  placeholder="e.g., brown"
                />
              </FormGroup>

              <FormGroup>
                <Label>Skin Color</Label>
                <Input
                  type="text"
                  name="skinColor"
                  value={formData.skinColor}
                  onChange={handleChange}
                  placeholder="e.g., fair"
                />
              </FormGroup>

              <FormGroup>
                <Label>Eye Color</Label>
                <Input
                  type="text"
                  name="eyeColor"
                  value={formData.eyeColor}
                  onChange={handleChange}
                  placeholder="e.g., blue"
                />
              </FormGroup>

              <FormGroup>
                <Label>Birth Year</Label>
                <Input
                  type="text"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  placeholder="e.g., 19BBY"
                />
              </FormGroup>

              <FormGroup>
                <Label>Gender</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="hermaphrodite">Hermaphrodite</option>
                  <option value="n/a">N/A</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Homeworld</Label>
                <Select
                  name="homeworldId"
                  value={formData.homeworldId}
                  onChange={handleChange}
                >
                  <option value="">Select homeworld</option>
                  {planets.map(planet => (
                    <option key={planet.id} value={planet.id}>
                      {planet.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

              <ButtonGroup>
                <SecondaryButton
                  type="button"
                  onClick={handleClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} />
                  {loading ? 'Creating...' : 'Create Character'}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default AddCharacterModal;