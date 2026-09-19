# Exam Questions — Full Study Guide

---

## Section 1: Machine Learning — General

---

### Question 1 — Single Choice
**Time: 2 Minutes**
**Difficulty: Easy**

Which of the following best describes supervised learning?

- [ ] A. The model learns patterns from unlabeled data without any guidance
- [ ] B. The model learns a mapping from inputs to outputs using labeled training data
- [ ] C. The model learns by interacting with an environment and receiving rewards or penalties
- [ ] D. The model clusters data points into groups based on similarity

**Correct Answer: B**

- A — Wrong: This describes unsupervised learning.
- B — Correct: Supervised learning uses labeled input-output pairs to train the model.
- C — Wrong: This describes reinforcement learning.
- D — Wrong: This describes unsupervised clustering.

---

## Section 2: Classification

---

### Question 2 — Single Choice
**Time: 2 Minutes**
**Difficulty: Easy**

Which of the following best describes a classification problem in machine learning?

- [ ] A. Predicting a continuous numerical output for a given input
- [ ] B. Grouping similar data points together without using any labels
- [ ] C. Predicting which discrete category or class a new input belongs to
- [ ] D. Reducing the number of features in the dataset

**Correct Answer: C**

- A — Wrong: This describes a regression problem.
- B — Wrong: This describes unsupervised clustering.
- C — Correct: Classification assigns an input to one of a fixed set of discrete classes.
- D — Wrong: This describes dimensionality reduction such as PCA.

---

## Section 3: Classification Metrics

---

### Question 3 — Single Choice
**Time: 2 Minutes**
**Difficulty: Easy**

In binary classification, which of the following correctly defines Precision?

- [ ] A. TP / (TP + FN)
- [ ] B. TP / (TP + FP)
- [ ] C. (TP + TN) / (TP + TN + FP + FN)
- [ ] D. TN / (TN + FP)

**Correct Answer: B**

| Formula | Metric Name |
|---|---|
| TP / (TP + FP) | Precision |
| TP / (TP + FN) | Recall (Sensitivity) |
| (TP + TN) / Total | Accuracy |
| TN / (TN + FP) | Specificity |

- A — Wrong: This is the formula for Recall.
- B — Correct: Precision measures how many predicted positives were actually positive.
- C — Wrong: This is the formula for Accuracy.
- D — Wrong: This is the formula for Specificity.

---

## Section 4: K-Nearest Neighbors (KNN)

---

### Question 4 — Multiple Choice
**Time: 5 Minutes**
**Difficulty: Medium**

Which of the following statements correctly describe KNN?
*Select all that apply.*

- [ ] A. KNN performs most of its computational work during training to learn an explicit decision function.
- [ ] B. KNN is considered a Lazy Learning algorithm because it postpones most of the computation until a prediction is requested.
- [ ] C. In KNN, the training phase mainly involves storing the training instances rather than learning a fixed parametric model.
- [ ] D. Increasing the training dataset always makes KNN prediction faster because more neighbors are available.

**Correct Answers: B, C**

- A — Wrong: KNN does almost no computational work during training.
- B — Correct: KNN delays all computation until prediction time, which is the definition of Lazy Learning.
- C — Correct: The training phase in KNN is simply storing the data — no model is explicitly learned.
- D — Wrong: More training data means more distance calculations at prediction time, making it slower not faster.

---

### Question 5 — Multiple Choice
**Time: 4 Minutes**
**Difficulty: Medium**

Suppose you are using KNN for a binary classification problem. You observe that with K = 1, the model perfectly classifies the training data but performs poorly on unseen data. Which changes are likely to help?
*Select all that apply.*

- [ ] A. Increase K to make the prediction less sensitive to individual noisy training points.
- [ ] B. Decrease K further because a smaller K always improves generalization.
- [ ] C. Use an appropriate feature-scaling method before calculating distances.
- [ ] D. Increase K indefinitely until the model achieves 100% training accuracy.

**Correct Answers: A, C**

- A — Correct: Higher K produces a smoother decision boundary and reduces overfitting.
- B — Wrong: Smaller K increases sensitivity to noise, making overfitting worse.
- C — Correct: Feature scaling ensures all features contribute fairly to the distance calculation.
- D — Wrong: Very large K leads to underfitting and does not produce 100% training accuracy.

---

## Section 5: Support Vector Machines (SVM)

---

### Question 6 — Single Choice
**Time: 4 Minutes**
**Difficulty: Medium**

In a Soft-Margin SVM, the optimization problem is:

```
minimize:
  (1/2)||w||^2 + C * sum(xi_i)

subject to:
  y_i(w^T x_i + b) >= 1 - xi_i
  xi_i >= 0
```

Suppose we increase C significantly while keeping the dataset and kernel fixed.
Which of the following is the most accurate consequence?

- [ ] A. The SVM will prioritize maximizing the margin and tolerate more margin violations.
- [ ] B. The SVM will penalize margin violations more heavily and tend to fit the training data more strictly.
- [ ] C. The SVM will automatically change the kernel from linear to nonlinear.
- [ ] D. The SVM will make the value of xi_i larger for every training point.

**Correct Answer: B**

- A — Wrong: Large C means less tolerance for violations, not more.
- B — Correct: Large C increases the penalty per violation, forcing a stricter fit on the training data.
- C — Wrong: C has no effect on the kernel type.
- D — Wrong: Large C forces xi_i to be smaller, not larger.

---

### Question 7 — Single Choice
**Time: 4 Minutes**
**Difficulty: Medium**

Consider a training example for which:

```
y_i(w^T x_i + b) = 0.6
```

Using the Soft-Margin SVM constraint:

```
y_i(w^T x_i + b) >= 1 - xi_i
```

Assuming the smallest possible value of xi_i is used, which statement is correct?

- [ ] A. xi_i = 0, and the point is outside the margin.
- [ ] B. xi_i = 0.4, and the point is correctly classified but lies inside the margin.
- [ ] C. xi_i = 1.6, and the point is misclassified.
- [ ] D. xi_i = 0.6, and the point lies exactly on the margin.

**Correct Answer: B**

Calculation:
```
0.6 >= 1 - xi_i
xi_i >= 1 - 0.6
xi_i = 0.4   (minimum value)
```

Since 0 < xi_i < 1, the point is correctly classified but lies inside the margin.

---

### Question 8 — Multiple Choice
**Time: 5 Minutes**
**Difficulty: Medium**

Which of the following statements correctly describe the relationship between C and the Soft-Margin SVM?
*Select all that apply.*

- [ ] A. A larger C makes violations of the margin more expensive.
- [ ] B. A smaller C generally corresponds to stronger regularization and allows the model to tolerate more violations.
- [ ] C. As C becomes very large, the Soft-Margin SVM can approach Hard-Margin behavior when the data is linearly separable.
- [ ] D. Increasing C always makes a Linear SVM decision boundary nonlinear.
- [ ] E. C controls the distance between the two margin hyperplanes directly.

**Correct Answers: A, B, C**

- A — Correct: Larger C assigns a higher penalty per margin violation.
- B — Correct: Smaller C allows more violations, which acts as stronger regularization.
- C — Correct: As C approaches infinity, no violations are allowed, which is equivalent to Hard-Margin SVM.
- D — Wrong: C does not change the kernel type or the linearity of the boundary.
- E — Wrong: C controls the violation penalty, not the margin width directly.

---

### Question 9 — Multiple Choice
**Time: 6 Minutes**
**Difficulty: Hard**

In the dual formulation of the Soft-Margin SVM, the Lagrange multipliers satisfy:

```
0 <= alpha_i <= C
```

Which statements correctly follow from this relationship?
*Select all that apply.*

- [ ] A. C acts as an upper bound on each alpha_i.
- [ ] B. A training point with alpha_i = 0 does not contribute directly to the SVM decision function.
- [ ] C. A point with 0 < alpha_i < C is typically located exactly on the margin.
- [ ] D. A point with alpha_i = C must always be correctly classified and lie outside the margin.
- [ ] E. The constraint alpha_i <= C comes from the Slack Variable term C * sum(xi_i) in the primal optimization problem.

**Correct Answers: A, B, C, E**

- A — Correct: By definition of the dual constraint.
- B — Correct: Non-support vectors have alpha_i = 0 and do not influence the decision boundary.
- C — Correct: Points exactly on the margin are support vectors with 0 < alpha_i < C.
- D — Wrong: alpha_i = C indicates a margin violator, which may be misclassified.
- E — Correct: The upper bound C originates from the slack penalty term in the primal problem.

---

## Section 6: Principal Component Analysis (PCA)

---

### Question 10 — Single Choice
**Time: 2 Minutes**
**Difficulty: Easy**

What is the main purpose of Principal Component Analysis (PCA)?

- [ ] A. To increase the number of features in a dataset
- [ ] B. To reduce the dimensionality of data while preserving as much variance as possible
- [ ] C. To convert a classification problem into a regression problem
- [ ] D. To eliminate the need for training data

**Correct Answer: B**

PCA identifies directions of maximum variance and projects the data onto a lower-dimensional space while retaining as much information as possible.

---

### Question 11 — Single Choice
**Time: 3 Minutes**
**Difficulty: Easy**

Which statement correctly describes the relationship between PCA, eigenvectors, and eigenvalues?

- [ ] A. Eigenvalues determine the direction of the new axes, while eigenvectors determine the variance
- [ ] B. Eigenvectors determine the directions of the new axes, while eigenvalues indicate the amount of variance captured in those directions
- [ ] C. Both eigenvectors and eigenvalues represent the original features of the dataset
- [ ] D. Eigenvectors are used to calculate the target variable, while eigenvalues are used for normalization

**Correct Answer: B**

- Eigenvectors define the direction of each principal component axis.
- Eigenvalues measure the amount of variance explained by each corresponding principal component.

---

### Question 12 — Single Choice
**Time: 4 Minutes**
**Difficulty: Medium**

Suppose a dataset has four principal components with the following eigenvalues:

```
lambda_1 = 8,  lambda_2 = 4,  lambda_3 = 2,  lambda_4 = 1
```

If we want to retain at least 85% of the total variance, how many principal components should we keep?

- [ ] A. 1
- [ ] B. 2
- [ ] C. 3
- [ ] D. 4

**Correct Answer: C**

Calculation:
```
Total variance = 8 + 4 + 2 + 1 = 15

PC1:               8 / 15 = 53.3%
PC1 + PC2:        12 / 15 = 80.0%   -> below 85%
PC1 + PC2 + PC3:  14 / 15 = 93.3%   -> above 85%  (keep 3)
```

---

## Section 7: Logistic Regression

---

### Question 13 — Single Choice
**Time: 3 Minutes**
**Difficulty: Medium**

In Logistic Regression, the model computes:

```
z = w^T x + b
p = 1 / (1 + e^(-z))
```

If the model predicts p = 0.9 for a sample whose true label is y = 0,
which statement is MOST accurate?

- [ ] A. The prediction is correct because p > 0.5.
- [ ] B. The model will have a small Binary Cross-Entropy loss because p is close to 1.
- [ ] C. The model will have a large Binary Cross-Entropy loss because it is highly confident in an incorrect class.
- [ ] D. The model cannot produce p = 0.9 when y = 0.

**Correct Answer: C**

Calculation:
```
Loss = -[ y * log(p) + (1 - y) * log(1 - p) ]
     = -[ 0 * log(0.9) + 1 * log(0.1) ]
     = -log(0.1)
     ≈ 2.30   (very large loss)
```

The model is 90% confident in the wrong class, which results in a very large penalty.

---

### Question 14 — Single Choice
**Time: 5 Minutes**
**Difficulty: Hard**

For a single training example in Logistic Regression, suppose:

```
y = 1,   p = 0.8
x = [2, -3]^T
```

Given that:

```
dL/dw = (p - y) * x
```

What is the gradient with respect to w?

- [ ] A. [0.4, -0.6]^T
- [ ] B. [-0.4, 0.6]^T
- [ ] C. [-0.2, 0.3]^T
- [ ] D. [0.2, -0.3]^T

**Correct Answer: B**

Calculation:
```
(p - y) = 0.8 - 1.0 = -0.2

dL/dw = -0.2 * [2, -3]^T
      = [-0.4, 0.6]^T
```

---

## Section 8: Gradient Descent

---

### Question 15 — Single Choice
**Time: 2 Minutes**
**Difficulty: Easy**

What is the main goal of Gradient Descent?

- [ ] A. Increase the number of features
- [ ] B. Minimize the loss/cost function
- [ ] C. Maximize the learning rate
- [ ] D. Increase the training dataset

**Correct Answer: B**

Gradient Descent is an optimization algorithm that minimizes the cost function by iteratively updating model parameters in the direction of the negative gradient.

---

### Question 16 — Single Choice
**Time: 2 Minutes**
**Difficulty: Easy**

In Gradient Descent, what does the learning rate alpha control?

- [ ] A. The number of training examples
- [ ] B. The direction of the gradient
- [ ] C. The size of the parameter update step
- [ ] D. The value of the loss function

**Correct Answer: C**

The learning rate alpha determines how large each parameter update step is during training.

---

### Question 17 — Multiple Choice
**Time: 3 Minutes**
**Difficulty: Easy**

Which of the following are true about Gradient Descent?
*Select all that apply.*

- [ ] A. It is an optimization algorithm.
- [ ] B. It can be used to minimize a cost function.
- [ ] C. It always finds the global minimum.
- [ ] D. It updates model parameters iteratively.

**Correct Answers: A, B, D**

- A — Correct: Gradient Descent is fundamentally an optimization algorithm.
- B — Correct: Its primary purpose is to minimize the cost function.
- C — Wrong: Non-convex cost functions contain local minima and saddle points that can prevent GD from reaching the global minimum.
- D — Correct: Parameters are updated step by step each iteration.

---

### Question 18 — Single Choice
**Time: 3 Minutes**
**Difficulty: Medium**

Consider the update rule:

```
theta := theta - alpha * (dJ(theta) / d_theta)
```

If the gradient is positive, what happens to theta?

- [ ] A. theta increases
- [ ] B. theta decreases
- [ ] C. theta remains unchanged
- [ ] D. theta becomes zero

**Correct Answer: B**

```
theta_new = theta - alpha * (positive value)
          = theta - (something positive)
```

Therefore theta decreases and moves in the negative direction toward the minimum.

---

### Question 19 — Multiple Choice
**Time: 4 Minutes**
**Difficulty: Medium**

Which situations can occur if the learning rate is too large?
*Select all that apply.*

- [ ] A. The algorithm may overshoot the minimum.
- [ ] B. The cost function may oscillate.
- [ ] C. The algorithm may diverge.
- [ ] D. The algorithm will always converge faster.

**Correct Answers: A, B, C**

- A — Correct: Large steps can cause the update to jump past the minimum.
- B — Correct: Repeated overshooting causes the loss to oscillate up and down.
- C — Correct: Extreme overshooting can cause the loss to grow indefinitely (diverge).
- D — Wrong: A large learning rate does not guarantee faster convergence and often prevents it entirely.

---

### Question 20 — Single Choice
**Time: 3 Minutes**
**Difficulty: Medium**

Suppose Gradient Descent reaches a point where:

```
dJ / d_theta = 0
```

What does this indicate?

- [ ] A. The parameter must be at the global minimum.
- [ ] B. There is no gradient-based change at that point.
- [ ] C. The learning rate is zero.
- [ ] D. The cost function is necessarily constant everywhere.

**Correct Answer: B**

When the gradient is zero, the update becomes:
```
theta := theta - alpha * 0 = theta
```
No change occurs. This could correspond to a global minimum, a local minimum, or a saddle point — not necessarily the global minimum.

---

### Question 21 — Multiple Choice
**Time: 4 Minutes**
**Difficulty: Medium**

Which statements correctly describe Batch Gradient Descent?
*Select all that apply.*

- [ ] A. It computes the gradient using the entire training dataset for each update.
- [ ] B. Each update can be computationally expensive for very large datasets.
- [ ] C. The gradient estimate is generally less noisy than in SGD.
- [ ] D. It updates the parameters after processing exactly one training example.

**Correct Answers: A, B, C**

- A — Correct: The full dataset is used per update — that is the definition of Batch GD.
- B — Correct: Processing all data per step is expensive for large datasets.
- C — Correct: Using all data produces a stable and accurate gradient estimate.
- D — Wrong: Processing exactly one example per update describes Stochastic Gradient Descent (SGD).

---

### Question 22 — Multiple Choice
**Time: 5 Minutes**
**Difficulty: Hard**

Consider a one-dimensional cost function where:

```
theta          = 4
dJ / d_theta   = 6
alpha          = 0.1
```

Which statements are correct?
*Select all that apply.*

- [ ] A. The new parameter is 3.4.
- [ ] B. The parameter moves in the negative direction.
- [ ] C. The update is -0.6.
- [ ] D. The new parameter is 4.6.

**Correct Answers: A, B, C**

Calculation:
```
theta_new = theta - alpha * (dJ / d_theta)
          = 4 - (0.1)(6)
          = 4 - 0.6
          = 3.4
```

- Update = -0.6 (correct)
- Direction is negative since theta decreased from 4 to 3.4 (correct)
- D is wrong: 4.6 would result from adding the gradient instead of subtracting it.

---

### Question 23 — Multiple Choice
**Time: 6 Minutes**
**Difficulty: Very Hard**

A model is being trained using Gradient Descent. During training you observe the following behavior:

```
J(theta):  10.2  ->  8.7  ->  7.1  ->  9.4  ->  6.8  ->  11.3
```

Which explanations are plausible?
*Select all that apply.*

- [ ] A. The learning rate may be too large.
- [ ] B. The optimization process may be overshooting the minimum.
- [ ] C. The cost function is necessarily non-convex.
- [ ] D. Reducing the learning rate may help stabilize training.
- [ ] E. The model must be suffering from underfitting.

**Correct Answers: A, B, D**

- A — Correct: Erratic jumps in the loss are a classic sign of a learning rate that is too large.
- B — Correct: The loss decreasing then jumping back up indicates the optimizer is overshooting the minimum.
- C — Wrong: This behavior can occur even on convex functions when the learning rate is too large.
- D — Correct: Reducing alpha is the standard remedy for this type of instability.
- E — Wrong: Underfitting refers to model capacity, not to this loss oscillation pattern.

---

## Section 9: Ensemble Learning

---

### Question 24 — Single Choice
**Time: 3 Minutes**
**Difficulty: Easy**

Which of the following best describes Ensemble Learning?

- [ ] A. Training a single complex model on the entire dataset to maximize accuracy
- [ ] B. Combining multiple models to produce a stronger overall prediction than any individual model
- [ ] C. Reducing the number of features before training a single model
- [ ] D. Using one model to label unlabeled data for use by a second model

**Correct Answer: B**

Ensemble Learning combines the predictions of multiple base models to reduce variance, reduce bias, or improve overall prediction accuracy compared to using any single model alone.

---

### Question 25 — Multiple Choice
**Time: 4 Minutes**
**Difficulty: Medium**

Which of the following statements correctly describe Random Forest?
*Select all that apply.*

- [ ] A. It is an ensemble method that builds multiple decision trees.
- [ ] B. Each tree is trained on a random subset of the training data using bootstrapping (sampling with replacement).
- [ ] C. It uses boosting to sequentially correct the errors of previous trees.
- [ ] D. The final classification prediction is determined by majority voting among all trees.
- [ ] E. At each split, a random subset of features is considered to increase diversity among trees.

**Correct Answers: A, B, D, E**

- A — Correct: Random Forest is an ensemble of decision trees.
- B — Correct: Bootstrapping creates a different training subset for each tree, increasing diversity.
- C — Wrong: Random Forest uses bagging (parallel training), not boosting. Boosting is used in AdaBoost and Gradient Boosting.
- D — Correct: For classification, the final output is the majority vote across all trees.
- E — Correct: Random feature selection at each node is a core mechanism that reduces correlation between trees.

---

## Exam Summary Table

| # | Topic | Type | Difficulty | Time |
|---|-------|------|------------|------|
| 1 | ML General — Supervised Learning | Single Choice | Easy | 2 min |
| 2 | Classification — Definition | Single Choice | Easy | 2 min |
| 3 | Classification Metrics — Precision | Single Choice | Easy | 2 min |
| 4 | KNN — Lazy Learning | Multiple Choice | Medium | 5 min |
| 5 | KNN — Overfitting (K=1) | Multiple Choice | Medium | 4 min |
| 6 | SVM — Effect of large C | Single Choice | Medium | 4 min |
| 7 | SVM — Slack variable xi_i | Single Choice | Medium | 4 min |
| 8 | SVM — C and regularization | Multiple Choice | Medium | 5 min |
| 9 | SVM — Dual formulation alpha_i | Multiple Choice | Hard | 6 min |
| 10 | PCA — Main purpose | Single Choice | Easy | 2 min |
| 11 | PCA — Eigenvectors and Eigenvalues | Single Choice | Easy | 3 min |
| 12 | PCA — Variance retention (calculation) | Single Choice | Medium | 4 min |
| 13 | Logistic Regression — Loss intuition | Single Choice | Medium | 3 min |
| 14 | Logistic Regression — Gradient calculation | Single Choice | Hard | 5 min |
| 15 | Gradient Descent — Main goal | Single Choice | Easy | 2 min |
| 16 | Gradient Descent — Learning rate role | Single Choice | Easy | 2 min |
| 17 | Gradient Descent — True statements | Multiple Choice | Easy | 3 min |
| 18 | Gradient Descent — Positive gradient effect | Single Choice | Medium | 3 min |
| 19 | Gradient Descent — Large learning rate | Multiple Choice | Medium | 4 min |
| 20 | Gradient Descent — Zero gradient | Single Choice | Medium | 3 min |
| 21 | Gradient Descent — Batch GD | Multiple Choice | Medium | 4 min |
| 22 | Gradient Descent — Parameter update calculation | Multiple Choice | Hard | 5 min |
| 23 | Gradient Descent — Erratic loss behavior | Multiple Choice | Very Hard | 6 min |
| 24 | Ensemble Learning — Definition | Single Choice | Easy | 3 min |
| 25 | Ensemble Learning — Random Forest | Multiple Choice | Medium | 4 min |
| | | | **Total** | **~94 min** |
