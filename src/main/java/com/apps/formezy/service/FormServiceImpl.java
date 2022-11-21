package com.apps.formezy.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.apps.formezy.exception.CustomException;
import com.apps.formezy.exception.DuplicateFormException;
import com.apps.formezy.exception.NotFoundException;
import com.apps.formezy.model.Form;
import com.apps.formezy.model.FormAnalytics;
import com.apps.formezy.model.FormField;
import com.apps.formezy.model.FormRequestBody;
import com.apps.formezy.model.FormResponse;
import com.apps.formezy.repository.FormAnalyticsRepository;
import com.apps.formezy.repository.FormFieldRepository;
import com.apps.formezy.repository.FormRepository;
import com.apps.formezy.repository.FormResponseRepository;
import com.mongodb.client.result.DeleteResult;

@Service
public class FormServiceImpl implements FormService {

	@Autowired
	private FormRepository formRepository;
	
	@Autowired
	private FormResponseRepository formResponseRepository;
	@Autowired
	private MongoTemplate mongoTemplateForFormResponseRepository;
	
	@Autowired
	private FormAnalyticsRepository formAnalyticsRepository;
	
	@Autowired
	private FormFieldRepository formFieldRepository;
	@Autowired
	private MongoTemplate mongoTemplateForFormFieldRepository;

	@Override
	public List<FormRequestBody> getAll() {
		List<Form> forms = formRepository.findAll();
		List<FormRequestBody> finalForms = new ArrayList<FormRequestBody>();
		
		//get form fields
		for(int i=0;i<forms.size();i++) {
			Form currForm = forms.get(i);
			
			Query query = new Query();
			query.addCriteria(Criteria.where("formId").is(currForm.getId()));;
			List<FormField> populatedFields = mongoTemplateForFormFieldRepository.find(query, FormField.class);
			
			FormRequestBody finalForm = new FormRequestBody(currForm.getId(), currForm.getName(), currForm.getDesc(), currForm.getType(), currForm.isActive(), currForm.getCompanyName(), new ArrayList<FormField>(), currForm.getCreated(), currForm.getUpdated());
			
			
			finalForm.setFields(populatedFields);
			finalForms.add(finalForm);
		}
		
		return finalForms;
	}

	@Override
	public FormRequestBody getById(String id) {
		Form currForm = formRepository.findById(id)
				.orElseThrow(
				() -> new NotFoundException(new Exception("Form not found"))
				);
		
		FormRequestBody finalForm = new FormRequestBody(currForm.getId(), currForm.getName(), currForm.getDesc(), currForm.getType(), currForm.isActive(), currForm.getCompanyName(), new ArrayList<FormField>(), currForm.getCreated(), currForm.getUpdated());

		Query query = new Query();
		query.addCriteria(Criteria.where("formId").is(currForm.getId()));;
		List<FormField> populatedFields = mongoTemplateForFormFieldRepository.find(query, FormField.class);
		
		finalForm.setFields(populatedFields);
		
		return finalForm;
		
	}
	
	
	public Form getByIdWithoutFields(String id) {
		return formRepository.findById(id)
				.orElseThrow(
				() -> new NotFoundException(new Exception("Form not found"))
				);
		
	}
	
	@Override
	public FormRequestBody insert(FormRequestBody FormRequestBody) {
		try {
			Form form = formRepository.save(
					new Form(
					FormRequestBody.getId(),
					FormRequestBody.getName(),
					FormRequestBody.getDesc(),
					FormRequestBody.getType(), 
					FormRequestBody.isActive(), 
					FormRequestBody.getCompanyName(),
					new ArrayList<String>(),
					LocalDateTime.now(),
					LocalDateTime.now()
					)
				);
			
			List<FormField> formFields = FormRequestBody.getFields();
			List<String> formFieldIds = new ArrayList<String>();
			for(int i=0;i<formFields.size();i++) {
				formFields.get(i).setId(null);
				formFields.get(i).setFormId(form.getId());
				String id = formFieldRepository.insertCustom(formFields.get(i)).getId();
				formFieldIds.add(id);
			}
			form.setFields(formFieldIds);
			String id = formRepository.save(form).getId();
			
			formAnalyticsRepository.save(new FormAnalytics(id, 0));
			
			return getById(id);
		}
		catch(DuplicateKeyException e) {
			throw new DuplicateFormException(e);
		}
		catch(Exception e) {
			throw new CustomException(e);
		}
	}

	@Override
	public FormRequestBody update(String id, FormRequestBody updatedForm) {
		try {
			Form form = getByIdWithoutFields(id);
			
//			List<String> fieldsToDelete = new ArrayList<String>();
//			List<String> fieldsToAdd = new ArrayList<String>();
//			List<String> fieldsToUpdate = new ArrayList<String>();
			
			List<FormField> updatedFormFields = updatedForm.getFields();
			List<String> currFormFieldIds = form.getFields();
			List<String> newFormFieldIds = new ArrayList<String>();
			
			for(int i=0;i<updatedFormFields.size();i++) {
				FormField field = updatedFormFields.get(i);
				String insertedId;
				//check if new field is added
				if(!currFormFieldIds.contains(field.getId())) {
					field.setId(null);
					field.setFormId(id);
					insertedId = formFieldRepository.insertCustom(field).getId();
					newFormFieldIds.add(insertedId);
				}
				//check if existing field is being updated
				else if(currFormFieldIds.contains(field.getId())) {
					insertedId = formFieldRepository.updateCustom(field).getId();
					newFormFieldIds.add(insertedId);
				}
			}
			
			//delete remaining form fields
			for(int i=0;i<currFormFieldIds.size();i++) {
				String currId = currFormFieldIds.get(i);
				if(!newFormFieldIds.contains(currId)) {
					formFieldRepository.deleteById(currId);
				}
			}
			
			//update form
			form.setName(updatedForm.getName());
			form.setDesc(updatedForm.getDesc());
			form.setActive(updatedForm.isActive());
			form.setType(updatedForm.getType());
			form.setCompanyName(updatedForm.getCompanyName());
			form.setFields(newFormFieldIds);
			
			formRepository.updateCustom(form);
			
			return getById(id);
		}
		catch(DuplicateKeyException e) {
			throw new DuplicateFormException(e);
		}
		catch(Exception e) {
			throw new CustomException(e);
		}
	}

	@Override
	public String delete(String id) {
		try {
			formRepository.deleteById(id);

			//delete related fields
			Query query = new Query();
			query.addCriteria(Criteria.where("formId").is(id));;
			mongoTemplateForFormFieldRepository.remove(query, FormField.class);
			
			return "Form deleted successfully";
		}
		catch(Exception e) {
			throw new CustomException(e);
		}
	}

	@Override
	public String submitResponse(String id, Object values) {
		try {
			FormResponse response = new FormResponse(null, id, values);
			formResponseRepository.insertCustom(response);

			//update analytics for response count
			FormAnalytics formAnalytics = formAnalyticsRepository.findById(id).orElse(null);
			if(formAnalytics != null) {
				Integer currCount = formAnalytics.getRecordedResponsesCount();
				if(currCount == null || currCount == 0) {
					//get response counts
					Query query = new Query();
					query.addCriteria(Criteria.where("formId").is(id));
					currCount = mongoTemplateForFormResponseRepository.find(query, FormResponse.class).size()-1;
				}
				formAnalytics.setRecordedResponsesCount(currCount+1);
				formAnalytics.setUpdated(LocalDateTime.now());
				formAnalyticsRepository.save(formAnalytics);
			}
			
			return "Response recorded successfully";
		}
		catch(Exception e) {
			throw new CustomException(e);
		}
	}

	@Override
	public String updateVisitorCount(String id) {
		try {
			FormAnalytics formAnalytics = formAnalyticsRepository.findById(id).orElse(null);
			if(formAnalytics == null) {
				String formId = getById(id).getId();
				if(formId == null) {
					throw new NotFoundException(new Exception("Form does not exist"));
				}
				else {
					formAnalytics = new FormAnalytics(formId, 0);
					
					//get response counts
					Query query = new Query();
					query.addCriteria(Criteria.where("formId").is(id));
					formAnalytics.setRecordedResponsesCount(mongoTemplateForFormResponseRepository.find(query, FormResponse.class).size()+1);
				}
			}
			formAnalytics.setUniqueVisitorCount(formAnalytics.getUniqueVisitorCount()+1);
			formAnalytics.setUpdated(LocalDateTime.now());
			formAnalyticsRepository.save(formAnalytics);
			return "";
		}
		catch(NotFoundException e) {
			throw new NotFoundException(e.getError());
		}
		catch(Exception e) {
			throw new CustomException(e);
		}
	}

	@Override
	public List<FormAnalytics> getAnalytics() {
		return formAnalyticsRepository.findAll();
	}

	@Override
	public List<FormResponse> getResponses(String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("formId").is(id));
		
		return mongoTemplateForFormResponseRepository.find(query, FormResponse.class);
	}

}
