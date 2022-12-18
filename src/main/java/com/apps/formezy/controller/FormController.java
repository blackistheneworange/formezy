package com.apps.formezy.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apps.formezy.exception.CustomException;
import com.apps.formezy.exception.DuplicateFormException;

import com.apps.formezy.model.Form;
import com.apps.formezy.model.FormAnalytics;
import com.apps.formezy.model.FormRequestBody;
import com.apps.formezy.model.FormResponse;
import com.apps.formezy.service.FormService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/form")
public class FormController {
	
	@Autowired
	private FormService formService;

	@GetMapping
	public List<FormRequestBody> getAll() {
		return formService.getAll();
	}
	

	@GetMapping(path="{id}")
	public FormRequestBody getById(@PathVariable("id") String id) {
		return formService.getById(id);
	}

	@PostMapping
	public FormRequestBody add(@RequestBody FormRequestBody form) {
		return formService.insert(form);
	}
	

	@PutMapping(path="{id}")
	public FormRequestBody update(@PathVariable("id") String id, @RequestBody FormRequestBody form) {
		return formService.update(id, form);
	}
	

	@DeleteMapping(path="{id}")
	public String delete(@PathVariable("id") String id) {
		return formService.delete(id);
	}

	@GetMapping("/{id}/response")
	public List<FormResponse> getResponses(@PathVariable("id") String id) {
		return formService.getResponses(id);
	}
	
	@PostMapping("/{id}/response")
	public String submitResponse(@PathVariable("id") String id, @RequestBody Object values) {
		return formService.submitResponse(id, values);
	}
	

	@GetMapping("/analytics")
	public List<FormAnalytics> getAnalytics() {
		return formService.getAnalytics();
	}

	@PutMapping("/{id}/analytics/vc")
	public String updateVisitorsCount(@PathVariable("id") String id) {
		return formService.updateVisitorCount(id);
	}

//	@RequestMapping("/{id}/analytics")
//	@PutMapping(path="{id}")
//	public String updateVisitorCount(@PathVariable("id") String id, @RequestBody Object values) {
//		System.out.println(id);
//		return formService.updateVisitorCount(id);
//	}

}
