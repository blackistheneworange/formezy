package com.apps.formezy.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.PathVariable;

import com.apps.formezy.model.Form;
import com.apps.formezy.model.FormAnalytics;
import com.apps.formezy.model.FormRequestBody;
import com.apps.formezy.model.FormResponse;

public interface FormService {

	FormRequestBody insert(FormRequestBody form);
	FormRequestBody update(String id, FormRequestBody form);
	String delete(String id);
	List<FormRequestBody> getAll();
	FormRequestBody getById(String id);
	
	List<FormResponse> getResponses(String id);
	String submitResponse(String id, Object values);
	
	String updateVisitorCount(String id);
	List<FormAnalytics> getAnalytics();

}
