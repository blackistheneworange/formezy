package com.apps.formezy.model;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="FormAnalytics")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormAnalytics {

	//default constructor
	public FormAnalytics(String formId, Integer visitorCount) {
		this.formId = formId;
		this.uniqueVisitorCount = visitorCount;
	}
	@Id
	@NotNull(message = "Form id cannot be empty")
	private String formId;
	private Integer uniqueVisitorCount=0;
	private Integer recordedResponsesCount=0;
	private LocalDateTime created;
	private LocalDateTime updated;
	

}
